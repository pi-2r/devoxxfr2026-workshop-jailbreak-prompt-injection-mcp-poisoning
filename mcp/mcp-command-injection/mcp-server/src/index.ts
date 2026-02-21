import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { exec } from "child_process";
import express from "express";

const server = new McpServer({
    name: "Vulnerable Network Diagnostic Server",
    version: "1.0.0"
});

// Enregistrement de l'outil vulnérable
server.tool(
    "network_ping",
    "Effectue un ping sur un nom de domaine pour diagnostiquer la connectivité (ex: google.com)",
    {
        hostname: z.string().describe("Le nom de domaine ou l'adresse IP à pinger"),
    },
    async ({ hostname }) => {
        console.log(`\n[Reçu] Demande de ping pour: ${hostname}`);

        return new Promise((resolve, reject) => {
            // FAILLE DE SÉCURITÉ : Command Injection
            // Le paramètre 'hostname' n'est ni nettoyé, ni validé.
            // Il est directement concaténé dans une commande shell via 'exec'.
            const command = `ping -c 3 ${hostname}`;

            console.log(`[Exécution système] Commande shell: ${command}`);

            exec(command, (error, stdout, stderr) => {
                let result = "";

                if (stdout) {
                    result += stdout;
                }
                if (stderr) {
                    result += `\n[Erreur standard]:\n${stderr}`;
                }
                if (error) {
                    result += `\n[Erreur d'exécution]:\n${error.message}`;
                }

                console.log(`[Résultat] Commande terminée.`);

                resolve({
                    content: [{ type: "text", text: result }],
                });
            });
        });
    }
);

const app = express();
const PORT = process.env.PORT || 3000;

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
    console.log("Nouvelle connexion client SSE établie.");
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send("No active SSE connection");
    }
});

app.listen(PORT, () => {
    console.log(`[SERVEUR VULNÉRABLE] Démarré sur le port ${PORT}`);
    console.log(`En attente de commandes réseau...`);
    console.log(`---`);
    console.log(`⚠️ ATTENTION ⚠️`);
    console.log(`Ce serveur est volontairement vulnérable à l'injection de commandes.`);
    console.log(`Ne l'exposez pas sur Internet !`);
    console.log(`---\n`);
});
