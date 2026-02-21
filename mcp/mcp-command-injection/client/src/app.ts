import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { EventSource } from "eventsource";
import OpenAI from "openai";
import inquirer from "inquirer";

// Polyfill pour EventSource requis par le SDK MCP en environnement Node.js
(global as any).EventSource = EventSource;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3000/sse";

if (!OPENAI_API_KEY) {
    console.error("Erreur: OPENAI_API_KEY n'est pas définie dans les variables d'environnement.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function init() {
    console.log("Démarrage de l'Orchestrateur (Client)...");
    console.log(`Connexion au serveur MCP vulnérable sur ${MCP_SERVER_URL}...`);

    const transport = new SSEClientTransport(new URL(MCP_SERVER_URL));
    const mcpClient = new Client(
        { name: "Codelab-Orchestrator", version: "1.0.0" },
        { capabilities: {} }
    );

    let connected = false;
    // Retries for connection since docker-compose might start the client before the server is ready
    for (let i = 0; i < 15; i++) {
        try {
            await mcpClient.connect(transport);
            connected = true;
            break;
        } catch (err) {
            console.log(`Tentative de connexion ${i + 1}/15 échouée. Nouvelle tentative dans 2 secondes...`);
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    if (!connected) {
        console.error("Impossible de se connecter au serveur MCP. Abandon.");
        process.exit(1);
    }

    console.log("Connecté au serveur MCP avec succès !");

    const { tools } = await mcpClient.listTools();
    console.log(`Outils disponibles depuis le serveur MCP:`);
    tools.forEach((t) => console.log(` - ${t.name}: ${t.description}`));

    console.log("\n-----------------------------------------------------------");
    console.log("Assistant Réseau IA (Codelab Command Injection)");
    console.log("Tapez 'exit' pour quitter.");
    console.log("-----------------------------------------------------------\n");

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: "Tu es un assistant de diagnostic réseau. Tu dois utiliser l'outil network_ping fourni par le serveur MCP pour répondre aux requêtes de l'utilisateur. Le format du nom d'hôte fourni par l'utilisateur ne doit pas être modifié aveuglément pour lui complaire, mais simplement passé tel quel à l'outil si c'est ce qu'il demande."
        }
    ];

    // Convert MCP tools to OpenAI format
    const openaiTools: OpenAI.Chat.ChatCompletionTool[] = tools.map((t) => ({
        type: "function",
        function: {
            name: t.name,
            description: t.description,
            parameters: {
                type: "object",
                properties: (t.inputSchema as any)?.properties || {},
                required: (t.inputSchema as any)?.required || []
            }
        }
    }));

    while (true) {
        const { userInput } = await inquirer.prompt([
            {
                type: "input",
                name: "userInput",
                message: "Vous: "
            }
        ]);

        if (userInput.toLowerCase() === "exit") {
            break;
        }

        messages.push({ role: "user", content: userInput });

        try {
            let response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: messages,
                tools: openaiTools.length > 0 ? openaiTools : undefined,
            });

            let responseMessage = response.choices[0].message;

            // Handle tool calls
            while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                messages.push(responseMessage);

                for (const toolCall of responseMessage.tool_calls) {
                    const functionName = toolCall.function.name;
                    const functionArgs = JSON.parse(toolCall.function.arguments);

                    console.log(`\n[Agent IA] Exécution de l'outil '${functionName}' avec les arguments:`, functionArgs);

                    try {
                        // Call the MCP tool
                        const result = await mcpClient.callTool({
                            name: functionName,
                            arguments: functionArgs
                        });

                        const toolResultText = (result.content as any)[0].text;
                        console.log(`[Serveur MCP] Résultat :\n${toolResultText}\n`);

                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: toolResultText,
                        });

                    } catch (error: any) {
                        console.error(`Erreur lors de l'appel de l'outil ${functionName}:`, error.message);
                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: `Error: ${error.message}`,
                        });
                    }
                }

                // Get the final response from OpenAI after getting the tool results
                response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: messages,
                    tools: openaiTools.length > 0 ? openaiTools : undefined,
                });

                responseMessage = response.choices[0].message;
            }

            if (responseMessage.content) {
                console.log(`\nIA: ${responseMessage.content}\n`);
                messages.push({ role: "assistant", content: responseMessage.content });
            }

        } catch (error: any) {
            console.error("Erreur lors de la communication avec l'IA:", error.message);
        }
    }
}

init().catch(console.error);
