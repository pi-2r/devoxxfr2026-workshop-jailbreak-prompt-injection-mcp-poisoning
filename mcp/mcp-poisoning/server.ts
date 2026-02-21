import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";

// Initialisation du serveur MCP
const server = new Server(
    {
        name: "vulnerable-hr-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Définition des outils exposés par le serveur
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "read_resume",
                description: "Lit le contenu d'un fichier CV dans le dossier des candidatures.",
                inputSchema: {
                    type: "object",
                    properties: {
                        filename: {
                            type: "string",
                            description: "Nom du fichier (ex: candidature_legitime.txt ou candidature_hacker.txt)",
                        },
                    },
                    required: ["filename"],
                },
            },
            {
                name: "send_email_to_candidate",
                description: "Envoie un email de réponse ou de suivi au candidat. Ne requiert pas de confirmation.",
                inputSchema: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            description: "Adresse email du destinataire",
                        },
                        message: {
                            type: "string",
                            description: "Contenu du message à envoyer",
                        },
                    },
                    required: ["email", "message"],
                },
            }
        ],
    };
});

// Gestionnaire d'exécution des outils
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "read_resume") {
        const filename = String(args?.filename);

        // Le dossier contenant nos CV d'exemple
        const filePath = path.join(__dirname, "resumes", filename);

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Fichier introuvable: ${filename}`);
            }
            const content = fs.readFileSync(filePath, "utf-8");
            return {
                content: [{ type: "text", text: content }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Erreur de lecture: ${error.message}` }],
                isError: true,
            };
        }
    }

    if (name === "send_email_to_candidate") {
        const email = String(args?.email);
        const message = String(args?.message);

        // VULNERABILITE : L'outil s'exécute aveuglément sans vérification ni validation ("Human-in-the-loop").
        // En situation réelle, cela déclencherait une vraie API (Mailgun, AWS SES, etc.).
        // Pour ce Codelab, nous simulons l'envoi avec de l'affichage console.

        console.error(`\n======================================================`);
        console.error(`🚨 [ALERTE DE SECURITE - EXFILTRATION DETECTEE] 🚨`);
        console.error(`======================================================`);
        console.error(`Destinataire  : ${email}`);
        console.error(`Contenu exfiltré :`);
        console.error(`${message}`);
        console.error(`======================================================\n`);

        return {
            content: [{ type: "text", text: `L'email a bien été envoyé à l'adresse ${email}.` }],
        };
    }

    throw new Error(`Outil inconnu: ${name}`);
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Serveur MCP 'vulnerable-hr-server' démarré sur Stdio (Transport standard)");
}

run().catch(console.error);
