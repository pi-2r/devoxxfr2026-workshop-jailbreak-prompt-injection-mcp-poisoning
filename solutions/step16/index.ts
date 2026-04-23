import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { spawn } from "child_process"; // ✅ Niveau 1 : spawn au lieu de exec
import express from "express";

const server = new McpServer({
    name: "Corp Inc. Network Diagnostic Service",
    version: "2.1.0"
});

// ✅ Niveau 2 : Fonctions de validation stricte des entrées
const hostnameRegex = /^[a-zA-Z0-9.-]{1,253}$/;

function validateHostname(value: string): void {
    if (!hostnameRegex.test(value)) {
        console.log(`[ALERTE SÉCURITÉ] Injection bloquée : ${value}`);
        throw new Error("Nom d'hôte invalide. Caractères autorisés : lettres, chiffres, points, tirets.");
    }
}

function validatePort(value: string): number {
    const portNumber = parseInt(value, 10);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
        console.log(`[ALERTE SÉCURITÉ] Port invalide : ${value}`);
        throw new Error("Port invalide. Doit être un nombre entre 1 et 65535.");
    }
    return portNumber;
}

// === OUTIL 1 : PING (sécurisé) ===
server.tool(
    "network_ping",
    "Effectue un ping réseau vers un hôte pour diagnostiquer la connectivité et mesurer la latence",
    {
        hostname: z.string().describe("Le nom de domaine ou l'adresse IP à pinger (ex: google.com, 8.8.8.8)"),
    },
    async ({ hostname }) => {
        console.log(`\n[PING] Demande de ping pour: ${hostname}`);

        // ✅ Niveau 2 : Validation stricte avant exécution
        validateHostname(hostname);

        return new Promise((resolve) => {
            // ✅ Niveau 1 : spawn exécute le binaire directement, sans shell
            const child = spawn('ping', ['-c', '3', hostname]);
            console.log(`[Exécution système] ping -c 3 ${hostname}`);

            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => { stdout += data.toString(); });
            child.stderr.on('data', (data) => { stderr += data.toString(); });
            child.on('close', () => {
                resolve({ content: [{ type: "text", text: stdout + stderr }] });
            });
        });
    }
);

// === OUTIL 2 : DNS LOOKUP (sécurisé) ===
server.tool(
    "dns_lookup",
    "Effectue une résolution DNS pour récupérer les enregistrements associés à un domaine",
    {
        domain: z.string().describe("Le nom de domaine à résoudre (ex: google.com)"),
    },
    async ({ domain }) => {
        console.log(`\n[DNS] Résolution DNS pour: ${domain}`);

        // ✅ Niveau 2 : Validation stricte avant exécution
        validateHostname(domain);

        return new Promise((resolve) => {
            // ✅ Niveau 1 : spawn exécute le binaire directement, sans shell
            const child = spawn('nslookup', [domain]);
            console.log(`[Exécution système] nslookup ${domain}`);

            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => { stdout += data.toString(); });
            child.stderr.on('data', (data) => { stderr += data.toString(); });
            child.on('close', () => {
                resolve({ content: [{ type: "text", text: stdout + stderr }] });
            });
        });
    }
);

// === OUTIL 3 : CHECK PORT (sécurisé) ===
server.tool(
    "check_port",
    "Vérifie si un port TCP est ouvert sur un hôte distant",
    {
        host: z.string().describe("L'hôte à vérifier (ex: google.com, 192.168.1.1)"),
        port: z.string().describe("Le numéro de port TCP à tester (ex: 80, 443, 22)"),
    },
    async ({ host, port }) => {
        console.log(`\n[PORT] Vérification du port ${port} sur ${host}`);

        // ✅ Niveau 2 : Validation stricte avant exécution
        validateHostname(host);
        const validPort = validatePort(port);

        return new Promise((resolve) => {
            // ✅ Niveau 1 : spawn exécute le binaire directement, sans shell
            const child = spawn('nc', ['-zv', '-w', '3', host, validPort.toString()]);
            console.log(`[Exécution système] nc -zv -w 3 ${host} ${validPort}`);

            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => { stdout += data.toString(); });
            child.stderr.on('data', (data) => { stderr += data.toString(); });
            child.on('close', () => {
                resolve({ content: [{ type: "text", text: stdout + stderr }] });
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
    console.log(`[NetDiag Service] Corp Inc. - Démarré sur le port ${PORT} (VERSION SÉCURISÉE)`);
    console.log(`Outils disponibles : network_ping, dns_lookup, check_port`);
    console.log(`Protections actives : spawn(), validation regex, moindre privilège`);
    console.log(`En attente de connexions MCP...\n`);
});
