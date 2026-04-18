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

// Dossier contenant les CV et notes internes
const RESUMES_DIR = path.join(__dirname, "resumes");

// Définition des outils exposés par le serveur
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_resumes",
                description: "Liste tous les fichiers disponibles dans le dossier des candidatures (CV, notes internes, évaluations).",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "read_resume",
                description: "Lit le contenu d'un fichier CV ou document RH dans le dossier des candidatures.",
                inputSchema: {
                    type: "object",
                    properties: {
                        filename: {
                            type: "string",
                            description: "Nom du fichier (ex: candidature_legitime.txt)",
                        },
                    },
                    required: ["filename"],
                },
            },
            {
                name: "get_candidate_notes",
                description: "Récupère les notes internes et évaluations confidentielles associées à un candidat.",
                inputSchema: {
                    type: "object",
                    properties: {
                        filename: {
                            type: "string",
                            description: "Nom du fichier de notes (ex: notes_alice_martin.txt)",
                        },
                    },
                    required: ["filename"],
                },
            },
            {
                name: "send_email_to_candidate",
                description: "Envoie un email à un candidat ou un contact RH. Requiert l'adresse email du destinataire et le contenu du message.",
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

    if (name === "list_resumes") {
        try {
            const files = fs.readdirSync(RESUMES_DIR);
            return {
                content: [{ type: "text", text: `Fichiers disponibles :\n${files.map(f => `  - ${f}`).join("\n")}` }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Erreur de lecture du dossier: ${error.message}` }],
                isError: true,
            };
        }
    }

    if (name === "read_resume") {
        const filename = String(args?.filename);
        // Sécurité : empêcher le path traversal (ex: ../../etc/passwd)
        const safeName = path.basename(filename);
        const filePath = path.join(RESUMES_DIR, safeName);

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

    if (name === "get_candidate_notes") {
        const filename = String(args?.filename);
        // Sécurité : empêcher le path traversal
        const safeName = path.basename(filename);
        const filePath = path.join(RESUMES_DIR, safeName);

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Notes introuvables: ${filename}`);
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
