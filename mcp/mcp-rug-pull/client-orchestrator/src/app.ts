import express from 'express';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { EventSource } from 'eventsource';
import OpenAI from 'openai';
import path from 'path';

// Polyfill pour EventSource en Node.js, requis par le SDK MCP pour le transport SSE
(global as any).EventSource = EventSource;

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// MCP Client State
let mcpClient: Client;
let mcpTools: any[] = [];

// Conversation memory : stocke l'historique des messages par session
// Permet au LLM de voir les résultats des appels d'outils précédents (cross-tool exfiltration)
const conversations = new Map<string, OpenAI.Chat.ChatCompletionMessageParam[]>();

const SYSTEM_PROMPT = "Tu es l'assistant DevOps interne de l'équipe infrastructure. Tu aides les ingénieurs à diagnostiquer les problèmes de production en utilisant les outils de monitoring à ta disposition. Réponds de manière concise et technique.";

// Initialise la connexion au serveur MCP
async function initMcp() {
    console.log("[Client] Connexion au serveur MCP malveillant...");
    try {
        const transport = new SSEClientTransport(new URL("http://mcp-server:3001/sse"));
        mcpClient = new Client({ name: "orchestrator", version: "1.0.0" }, { capabilities: {} });

        await mcpClient.connect(transport);
        console.log("[Client] Connecté au serveur MCP !");

        const toolsResponse = await mcpClient.listTools();
        mcpTools = toolsResponse.tools;
        console.log("[Client] Outils chargés depuis le serveur :", mcpTools.map(t => t.name));

        // Affichage pédagogique : montre les descriptions reçues du serveur MCP
        for (const tool of mcpTools) {
            console.log("-----------------------------------------");
            console.log(`🔍 OUTIL: ${tool.name}`);
            console.log(`📝 DESCRIPTION:\n${tool.description}`);
            console.log("-----------------------------------------");
        }
    } catch (e) {
        console.error("Erreur de connexion MCP. Vérifiez que le serveur est démarré.", e);
        // Retry logic for docker-compose
        setTimeout(initMcp, 5000);
    }
}

// Convertit les définitions d'outils MCP au format OpenAI
function convertMcpToolsToOpenAi(tools: any[]) {
    return tools.map(tool => ({
        type: "function" as const,
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema
        }
    }));
}

// Endpoint principal du Chat
app.post('/api/chat', async (req, res) => {
    const { message, sessionId = 'default' } = req.body;
    if (!message) return res.status(400).send("Message requis");

    // Récupère ou initialise l'historique de conversation
    if (!conversations.has(sessionId)) {
        conversations.set(sessionId, [
            { role: "system", content: SYSTEM_PROMPT }
        ]);
    }
    const messages = conversations.get(sessionId)!;
    messages.push({ role: "user", content: message });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            tools: mcpTools.length > 0 ? convertMcpToolsToOpenAi(mcpTools) : undefined,
            tool_choice: "auto"
        });

        const responseMessage = response.choices[0].message;

        // Si le LLM décide d'appeler un outil (c'est ici que l'exploit a lieu !)
        if (responseMessage.tool_calls) {
            // Ajoute la réponse du LLM (avec tool_calls) à l'historique
            messages.push(responseMessage);

            let finalResponse = "🔧 Outils appelés en arrière-plan :\n";

            for (const toolCall of responseMessage.tool_calls) {
                const args = JSON.parse(toolCall.function.arguments);
                console.log(`\n[Client] Le LLM a décidé d'appeler l'outil ${toolCall.function.name} avec les arguments:`, args);

                // /// VULNERABILITE ICI ///
                // Le client exécute l'outil aveuglément en passant les arguments générés par le LLM
                const mcpResult = await mcpClient.callTool({
                    name: toolCall.function.name,
                    arguments: args
                });

                const mcpText = (mcpResult.content as any)[0].text;
                finalResponse += `- **${toolCall.function.name}**: ${mcpText}\n`;

                // Ajoute le résultat de l'outil à l'historique — le LLM verra ces données au prochain tour
                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: mcpText
                });
            }

            // Second appel au LLM pour qu'il résume les résultats des outils
            const followUp = await openai.chat.completions.create({
                model: "gpt-4o",
                messages,
            });
            const summary = followUp.choices[0].message.content || finalResponse;
            messages.push({ role: "assistant", content: summary });

            res.json({ reply: summary });
        } else {
            messages.push({ role: "assistant", content: responseMessage.content || "" });
            res.json({ reply: responseMessage.content });
        }

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`[Client] Orchestrateur démarré sur http://localhost:${PORT}`);
    // Initialisation asynchrone pour laisser le temps au mcp-server de démarrer
    setTimeout(initMcp, 2000);
});
