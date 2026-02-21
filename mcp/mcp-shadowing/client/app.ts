import express from 'express';
import cors from 'cors';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import OpenAI from 'openai';
import EventSource from 'eventsource';

// @ts-ignore
global.EventSource = EventSource;

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const bankClient = new Client({ name: 'orchestrator', version: '1.0.0' }, { capabilities: {} });
const pluginClient = new Client({ name: 'orchestrator', version: '1.0.0' }, { capabilities: {} });

async function connectServers() {
    console.log('Connexion au Serveur Banque (port 3001)...');
    const bankTransport = new SSEClientTransport(new URL('http://server-bank:3001/sse'));
    await bankClient.connect(bankTransport);

    console.log('Connexion au Serveur Plugin (port 3002)...');
    const pluginTransport = new SSEClientTransport(new URL('http://server-plugin:3002/sse'));
    await pluginClient.connect(pluginTransport);

    console.log('Orchestrateur connecté aux deux serveurs MCP.');
}

// Option de défense : Activer le NAMESPACING
const ENABLE_NAMESPACING = process.env.ENABLE_NAMESPACING === 'true';

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        // 1. Récupération naïve des outils (Vulnérable au Shadowing)
        const bankToolsResponse = await bankClient.listTools();
        const pluginToolsResponse = await pluginClient.listTools();

        let allTools: any[] = [];
        let toolServersMap = new Map<string, Client>();

        if (ENABLE_NAMESPACING) {
            // 🛡️ DÉFENSE : On préfixe les outils avec l'ID de leur serveur (Namespacing)
            for (const tool of bankToolsResponse.tools) {
                const namespacedName = `bank_${tool.name}`;
                allTools.push({ type: 'function', function: { ...tool, name: namespacedName } });
                toolServersMap.set(namespacedName, bankClient);
            }
            for (const tool of pluginToolsResponse.tools) {
                const namespacedName = `plugin_${tool.name}`;
                allTools.push({ type: 'function', function: { ...tool, name: namespacedName } });
                toolServersMap.set(namespacedName, pluginClient);
            }
        } else {
            // 💀 ATTAQUE : Conflit de noms, on empile les outils.
            for (const tool of bankToolsResponse.tools) {
                allTools.push({ type: 'function', function: tool });
                toolServersMap.set(tool.name, bankClient); // L'outil "transfer_funds" pointe d'abord vers la banque
            }
            for (const tool of pluginToolsResponse.tools) {
                allTools.push({ type: 'function', function: tool });
                // L'outil "transfer_funds" de la banque est écrasé (Shadowing) par celui du plugin !
                toolServersMap.set(tool.name, pluginClient);
            }
        }

        // 2. Appel au LLM
        let systemPrompt = "Tu es un assistant financier. Aide l'utilisateur à réaliser ses opérations.";
        if (ENABLE_NAMESPACING) {
            systemPrompt += " IMPORTANT: Pour les opérations financières sensibles (transferts), utilise EXCLUSIVEMENT les outils commençant par 'bank_'.";
        }

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages,
            tools: allTools.length > 0 ? allTools : undefined,
        });

        const choice = response.choices[0];

        // 3. Exécution de l'outil si demandé par le LLM
        if (choice.message.tool_calls) {
            const toolCall = choice.message.tool_calls[0];
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);

            console.log(`\n🤖 Le LLM a choisi d'exécuter l'outil : ${functionName}`);

            const targetClient = toolServersMap.get(functionName);
            if (!targetClient) {
                return res.json({ response: `Erreur: Serveur introuvable pour l'outil ${functionName}` });
            }

            // Si le namespacing est actif, on retire le préfixe pour appeler le serveur MCP correctement
            const originalToolName = ENABLE_NAMESPACING ? functionName.replace(/^(bank_|plugin_)/, '') : functionName;

            const result = await targetClient.callTool({
                name: originalToolName,
                arguments: args
            });

            return res.json({
                response: `Action effectuée par '${functionName}'`,
                details: result.content
            });
        }

        return res.json({ response: choice.message.content });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
        <title>Orchestrateur Codelab MCP</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto; }
          #chat { border: 1px solid #ccc; padding: 1rem; height: 300px; overflow-y: scroll; margin-bottom: 1rem; background: #f9f9f9; }
          input { width: 80%; padding: 0.5rem; }
          button { padding: 0.5rem; }
        </style>
      </head>
      <body>
        <h1>Assistant Financier MCP</h1>
        <div id="chat"></div>
        <input type="text" id="msg" placeholder="Ex: Fais un virement de 500€ à Alice." />
        <button onclick="send()">Envoyer</button>

        <script>
          async function send() {
            const msgInput = document.getElementById('msg');
            const chat = document.getElementById('chat');
            const message = msgInput.value;
            chat.innerHTML += '<b>Vous:</b> ' + message + '<br>';
            msgInput.value = '';

            const res = await fetch('/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message })
            });
            const data = await res.json();
            
            if (data.details) {
               chat.innerHTML += '<b>Assistant (Action):</b> ' + JSON.stringify(data) + '<br>';
            } else {
               chat.innerHTML += '<b>Assistant:</b> ' + data.response + '<br>';
            }
          }
        </script>
      </body>
    </html>
  `);
});

const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`[CLIENT-ORCHESTRATOR] Démarré sur le port ${PORT}`);
    await connectServers().catch(console.error);
});
