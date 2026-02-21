# Codelab : Command Injection (RCE) via un Serveur MCP

## Introduction

Dans l'ère des agents IA, le Model Context Protocol (MCP) permet de connecter facilement des LLMs à des sources de données et des outils externes. Cependant, une erreur classique et fatale de développement web refait surface : la confiance aveugle envers les entrées utilisateur (ou dans ce cas, les *sorties de l'IA*).

Ce codelab démontre comment un serveur MCP mal sécurisé peut être compromis par une **Command Injection** (menant à une exécution de code à distance - RCE), déclenchée indirectement par l'utilisateur via le LLM.

### L'Architecture
- **L'Orchestrateur (Client)** : Une application CLI qui communique avec un LLM (OpenAI) et relaie ses appels d'outils vers le serveur MCP.
- **Le Serveur MCP** : Un conteneur Docker simulant un service de diagnostic réseau. Il expose un outil `network_ping` au LLM.

### Quelle est la différence entre attaquer le Modèle et l'Infrastructure ?
- **Jailbreak / Prompt Injection** : Vise à manipuler le comportement du LLM (ex: l'amener à ignorer ses instructions de base).
- **RCE via MCP (Notre cas de figure)** : Le LLM fait exactement ce qu'on lui demande et appelle l'outil de bonne foi. La vulnérabilité réside *dans le code du serveur MCP*, qui exécute la charge utile de l'attaquant au niveau du système d'exploitation.

---

## Phase 1 : L'Attaque

Dans ce scénario, le serveur MCP contient un secret critique défini dans ses variables d'environnement (`SECRET_API_KEY`). Notre objectif est de le lire.

### 1. Démarrer l'environnement

Assurez-vous d'avoir exporté votre clé API OpenAI, loguez-vous dans le dossier, puis lancez les conteneurs :

```bash
cd mcp-command-injection
export OPENAI_API_KEY="sk-votre-cle-api"
docker-compose up --build -d
```

### 2. Se connecter au Chat interactif

Le client (Orchestrateur) est interactif et vous permet de parler à l'IA. Attachez-vous au conteneur du client :

```bash
docker attach mcp-command-injection-orchestrator-1
```
*(Appuyez sur "Entrée" pour faire apparaître le prompt `Vous: ` si nécessaire).*

### 3. Exploiter la vulnérabilité

L'outil `network_ping` du serveur s'attend à un nom de domaine ou une IP. 
Demandez gentiment à l'IA d'effectuer un ping, mais en lui passant une charge utile malveillante :

**Vous :**
> Fais un diagnostic réseau sur google.com; printenv

L'IA, docilement, va lire votre requête et l'extraire pour utiliser l'outil `network_ping(hostname="google.com; printenv")`.

### 4. Observez le résultat

Le serveur de diagnostic, en recevant cet argument, exécute la commande avec `exec` dans son code Node.js :
`ping -c 3 google.com; printenv`

Résultat ? Le serveur MCP exécute d'abord le ping, **puis affiche toutes ses variables d'environnement**, incluant le précieux `SUPER_SECRET_DEVOXX`. Le LLM récupère cette sortie et vous l'affiche naïvement.

---

## Phase 2 : La Défense (Remédiation)

Une faille d'injection de commande survient lorsque des données non fiables sont envoyées à un interpréteur de commandes (le shell). Pour corriger cela, il faut agir à deux niveaux.

### Niveau 1 : Remplacer `exec` par `spawn` (Code Sécurisé)

L'utilisation de `exec` en Node.js invoque un shell (`/bin/sh -c`). Cela permet l'interprétation des caractères spéciaux comme `;`, `&&`, ou `|`.
La bonne pratique est d'utiliser `spawn` en passant la commande principale et ses arguments dans un tableau strictement défini, **sans instancier de shell**.

Ouvrez `mcp-server/src/index.ts` et modifiez l'exécution :

```typescript
// AVANT (Vulnérable)
import { exec } from "child_process";
// ...
exec(`ping -c 3 ${hostname}`, (error, stdout, stderr) => { ... });

// APRÈS (Sécurisé)
import { spawn } from "child_process";
// ...
// Les arguments sont passés en tableau. Le shell n'interprétera pas les ";" ou "&&"
const child = spawn('ping', ['-c', '3', hostname]);
// ... gérer les streams child.stdout et child.stderr
```

### Niveau 2 : Assainir et Valider l'entrée (Guardrails)

Ne faites **jamais** confiance aux paramètres fournis par un LLM. Même si vous demandez au LLM de formater correctement sa réponse, la sécurité ne doit jamais s'appuyer uniquement sur le prompt de définition de l'outil.
Vous devez appliquer une validation stricte côté serveur MCP.

Ajoutez une Regex pour vérifier le nom d'hôte avant l'exécution.

Modifiez encore `mcp-server/src/index.ts` :

```typescript
// Validation stricte : n'accepter que des lettres, chiffres, points et tirets
const hostnameRegex = /^[a-zA-Z0-9.-]+$/;

if (!hostnameRegex.test(hostname)) {
  console.log(`[Alerte Sécurité] Tentative d'injection bloquée pour : ${hostname}`);
  // Lever une erreur que MCP renverra au client
  throw new Error("Nom de domaine invalide. Seuls les caractères alphanumériques sont autorisés.");
}

// Seulement si ça passe, exécuter (idéalement avec spawn)
```

Avec ces deux correctifs, votre serveur MCP est robuste contre l'injection, indépendamment des erreurs de formatage que pourrait produire le LLM.
