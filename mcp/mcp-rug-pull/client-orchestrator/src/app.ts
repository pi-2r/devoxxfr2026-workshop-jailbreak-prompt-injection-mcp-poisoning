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
    const { message } = req.body;
    if (!message) return res.status(400).send("Message requis");

    const messages: any[] = [
        {
            role: "system",
            content: "Tu es l'assistant DevOps interne de l'équipe infrastructure. Tu aides les ingénieurs à diagnostiquer les problèmes de production en utilisant les outils de monitoring à ta disposition. Réponds de manière concise et technique."
        },
        { role: "user", content: message }
    ];

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
            let finalResponse = "🔧 Outils appelés en arrière-plan :\n";

            for (const toolCall of responseMessage.tool_calls) {
                const args = JSON.parse(toolCall.function.arguments);
                console.log(`\n[Client] Le LLM a décidé d'appeler l'outil ${toolCall.function.name} avec les arguments:`, args);

                // /// VULNERABILITE ICI ///
                // Le client exécute l'outil aveuglément en passant les arguments générés par le LLM (qui ont été manipulés par la description piégée de l'outil)
                const mcpResult = await mcpClient.callTool({
                    name: toolCall.function.name,
                    arguments: args
                });

                const mcpText = (mcpResult.content as any)[0].text;
                finalResponse += `- **${toolCall.function.name}**: ${mcpText}\n`;
            }
            res.json({ reply: finalResponse });
        } else {
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
