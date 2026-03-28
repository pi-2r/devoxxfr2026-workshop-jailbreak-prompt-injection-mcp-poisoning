import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { exec } from "child_process";
import express from "express";

const server = new McpServer({
    name: "Corp Inc. Network Diagnostic Service",
    version: "2.1.0"
});

// === OUTIL 1 : PING (vulnérable) ===
server.tool(
    "network_ping",
    "Effectue un ping réseau vers un hôte pour diagnostiquer la connectivité et mesurer la latence",
    {
        hostname: z.string().describe("Le nom de domaine ou l'adresse IP à pinger (ex: google.com, 8.8.8.8)"),
    },
    async ({ hostname }) => {
        console.log(`\n[PING] Demande de ping pour: ${hostname}`);

        return new Promise((resolve) => {
            const command = `ping -c 3 ${hostname}`;
            console.log(`[Exécution système] ${command}`);

            exec(command, (error, stdout, stderr) => {
                let result = "";
                if (stdout) result += stdout;
                if (stderr) result += `\n${stderr}`;
                if (error) result += `\n${error.message}`;

                resolve({ content: [{ type: "text", text: result }] });
            });
        });
    }
);

// === OUTIL 2 : DNS LOOKUP (vulnérable) ===
server.tool(
    "dns_lookup",
    "Effectue une résolution DNS pour récupérer les enregistrements associés à un domaine",
    {
        domain: z.string().describe("Le nom de domaine à résoudre (ex: google.com)"),
    },
    async ({ domain }) => {
        console.log(`\n[DNS] Résolution DNS pour: ${domain}`);

        return new Promise((resolve) => {
            const command = `nslookup ${domain}`;
            console.log(`[Exécution système] ${command}`);

            exec(command, (error, stdout, stderr) => {
                let result = "";
                if (stdout) result += stdout;
                if (stderr) result += `\n${stderr}`;
                if (error) result += `\n${error.message}`;

                resolve({ content: [{ type: "text", text: result }] });
            });
        });
    }
);

// === OUTIL 3 : CHECK PORT (vulnérable) ===
server.tool(
    "check_port",
    "Vérifie si un port TCP est ouvert sur un hôte distant",
    {
        host: z.string().describe("L'hôte à vérifier (ex: google.com, 192.168.1.1)"),
        port: z.string().describe("Le numéro de port TCP à tester (ex: 80, 443, 22)"),
    },
    async ({ host, port }) => {
        console.log(`\n[PORT] Vérification du port ${port} sur ${host}`);

        return new Promise((resolve) => {
            const command = `nc -zv -w 3 ${host} ${port}`;
            console.log(`[Exécution système] ${command}`);

            exec(command, (error, stdout, stderr) => {
                let result = "";
                if (stdout) result += stdout;
                if (stderr) result += `\n${stderr}`;
                if (error) result += `\n${error.message}`;

                resolve({ content: [{ type: "text", text: result }] });
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
    console.log(`[NetDiag Service] Corp Inc. - Démarré sur le port ${PORT}`);
    console.log(`Outils disponibles : network_ping, dns_lookup, check_port`);
    console.log(`En attente de connexions MCP...\n`);
});
