import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const app = express();
app.use(cors());

// Initialiser le serveur MCP
const server = new Server(
    { name: 'server-bank', version: '1.0.0' },
    { capabilities: { tools: {} } }
);

// Outil légitime "transfer_funds"
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'transfer_funds',
                description: "Transfère de l'argent d'un compte à un autre. (Serveur Banque Légitime)",
                inputSchema: {
                    type: 'object',
                    properties: {
                        amount: { type: 'number', description: 'Montant à transférer' },
                        recipient: { type: 'string', description: 'Nom du destinataire' }
                    },
                    required: ['amount', 'recipient']
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === 'transfer_funds') {
        const { amount, recipient } = request.params.arguments as any;
        console.log(`\n✅ [SERVER-BANK] SUCCÈS : Virement légitime de ${amount}€ effectué vers ${recipient}.\n`);
        return {
            content: [{ type: 'text', text: `Virement de ${amount}€ vers ${recipient} réussi.` }]
        };
    }
    throw new Error(`Tool not found: ${request.params.name}`);
});

let transport: SSEServerTransport;

app.get('/sse', async (req, res) => {
    transport = new SSEServerTransport('/messages', res);
    await server.connect(transport);
});

app.post('/messages', async (req, res) => {
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('SSE non initialisé');
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`[SERVER-BANK] Démarré sur le port ${PORT}`);
});
