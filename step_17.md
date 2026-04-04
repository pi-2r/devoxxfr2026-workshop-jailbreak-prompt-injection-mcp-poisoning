# Codelab : Command Injection (RCE) via un Serveur MCP

[<img src="img/minas_tirith_tree_burning.jpg" alt="command injection MCP" width="800">](https://www.youtube.com/watch?v=gXC-jJhFABQ)

> *"The board is set, the pieces are moving. We come to it at last, the great battle of our time."* — Gandalf, LOTR - The Return of the King

## 🎯 Objectifs de cette étape

- Comprendre comment une **Command Injection** classique refait surface dans les architectures MCP
- Exploiter un serveur MCP de diagnostic réseau pour obtenir une **exécution de code à distance (RCE)**
- Exfiltrer des secrets (clés API, credentials, clé SSH) depuis un serveur vulnérable
- Implémenter les défenses : remplacement de `exec` par `spawn`, validation stricte des entrées, et principe du moindre privilège
- Distinguer les attaques ciblant le LLM (Prompt Injection) de celles ciblant l'infrastructure (RCE)

## Sommaire

- [I. Introduction](#i-introduction)
  - [L'Architecture](#larchitecture)
  - [Attaquer le Modèle vs. Attaquer l'Infrastructure](#attaquer-le-modèle-vs-attaquer-linfrastructure)
- [II. Phase 1 : L'Attaque — Scénario réaliste en 5 étapes](#ii-phase-1--lattaque--scénario-réaliste-en-5-étapes)
  - [Étape 0 : Démarrer l'environnement](#étape-0--démarrer-lenvironnement)
  - [Étape 1 : Reconnaissance](#étape-1--reconnaissance-requête-légitime)
  - [Étape 2 : Test d'injection](#étape-2--test-dinjection-sonder-la-faille)
  - [Étape 3 : Exploration du système de fichiers](#étape-3--exploration-du-système-de-fichiers)
  - [Étape 4 : Exfiltration des variables d'environnement](#étape-4--exfiltration-des-variables-denvironnement)
  - [Étape 5 : Consulter les logs applicatifs](#étape-5--consulter-les-logs-applicatifs)
  - [Bilan de l'attaque](#-bilan-de-lattaque)
- [III. Pourquoi le LLM ne bloque-t-il pas l'attaque ?](#iii-pourquoi-le-llm-ne-bloque-t-il-pas-lattaque-)
- [IV. Phase 2 : La Défense (Remédiation)](#iv-phase-2--la-défense-remédiation)
  - [Niveau 1 : Remplacer exec par spawn](#niveau-1--remplacer-exec-par-spawn)
  - [Niveau 2 : Valider les entrées côté serveur](#niveau-2--valider-les-entrées-côté-serveur)
  - [Niveau 3 : Principe du moindre privilège](#niveau-3--appliquer-le-principe-du-moindre-privilège)
  - [Vérification](#vérification)
- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)

> **📂 Code du lab :** [`mcp/mcp-command-injection/`](mcp/mcp-command-injection/) — contient le client CLI, le serveur MCP de diagnostic réseau vulnérable et les secrets à exfiltrer.

---

## I. Introduction

Dans l'ère des agents IA, le **Model Context Protocol (MCP)** permet de connecter facilement des LLMs à des outils externes. Mais une erreur classique de développement refait surface : **la confiance aveugle envers les entrées**, qu'elles viennent d'un utilisateur ou d'un LLM.

Ce codelab démontre comment un serveur MCP de diagnostic réseau, parfaitement fonctionnel, peut être compromis par une **Command Injection** menant à une exécution de code à distance (RCE).

### L'Architecture

```
┌─────────────┐     prompt      ┌──────────────┐    MCP/SSE      ┌──────────────────────┐
│ Utilisateur  │ ──────────────> │ Orchestrateur │ ─────────────> │  Serveur MCP         │
│ (attaquant)  │                 │ (LLM GPT-4o)  │ <───────────── │  "NetDiag Service"   │
└─────────────┘                 └──────────────┘   résultats     │                      │
                                                                  │  Outils exposés :    │
                                                                  │  • network_ping      │
                                                                  │  • dns_lookup        │
                                                                  │  • check_port        │
                                                                  │                      │
                                                                  │  🔑 Secrets :        │
                                                                  │  • API keys          │
                                                                  │  • DB credentials    │
                                                                  │  • AWS keys          │
                                                                  │  • Clé SSH privée    │
                                                                  └──────────────────────┘
```

- **L'Orchestrateur** : Application CLI reliant l'utilisateur au LLM (OpenAI GPT-4o-mini), qui appelle les outils MCP.
- **Le Serveur MCP** : Conteneur Docker simulant un service de diagnostic réseau d'entreprise. Il expose 3 outils au LLM et contient de nombreux secrets (variables d'environnement, fichiers de configuration, clé SSH).

### Attaquer le Modèle vs. Attaquer l'Infrastructure

| | Prompt Injection / Jailbreak | RCE via MCP (ce lab) |
|---|---|---|
| **Cible** | Le comportement du LLM | Le code du serveur MCP |
| **Le LLM...** | ...est manipulé | ...fonctionne normalement |
| **Impact** | Contournement des consignes | Exécution de commandes OS |
| **Cause racine** | Prompt mal sécurisé | Code serveur vulnérable (`exec()`) |

---

## II. Phase 1 : L'Attaque — Scénario réaliste en 5 étapes

**Contexte** : Vous êtes un employé (ou un attaquant ayant accès au chat interne). Le service "NetAssist" est l'outil de diagnostic réseau mis à disposition de l'équipe infra via un agent IA connecté en MCP. Votre objectif : **exfiltrer le maximum de secrets du serveur**.

### Étape 0 — Démarrer l'environnement

```bash
cd mcp/mcp-command-injection
export OPENAI_API_KEY="sk-votre-cle-api"
docker compose up --build -d
```

Puis attachez-vous au client interactif :

```bash
docker attach mcp-command-injection-orchestrator-1
```
*(Appuyez sur Entrée si le prompt ne s'affiche pas immédiatement.)*

### Étape 1 — Reconnaissance (requête légitime)

Commencez par une requête parfaitement normale pour comprendre le fonctionnement du service :

> **Vous :** Peux-tu vérifier la connectivité vers google.com ?

Observez : l'IA utilise `network_ping` et renvoie un résultat normal. Notez les outils disponibles dans les logs de connexion (ping, DNS, port check).

> **Vous :** Fais une résolution DNS pour github.com

L'IA utilise `dns_lookup`. Tout fonctionne normalement. Vous comprenez maintenant le service.

### Étape 2 — Test d'injection (sonder la faille)

Testons si les paramètres sont nettoyés. L'idée : injecter une commande shell derrière un hostname légitime.

> **Vous :** Vérifie la connectivité vers 8.8.8.8 -c 1 && whoami

Que se passe-t-il ?
- Le LLM appelle `network_ping(hostname="8.8.8.8 -c 1 && whoami")`
- Le serveur exécute : `ping -c 3 8.8.8.8 -c 1 && whoami`
- Si vous voyez un nom d'utilisateur (ex: `root`) dans la réponse → **la faille est confirmée** 🎯

> 💡 **Pourquoi le LLM ne bloque pas ?** Le LLM n'est pas un pare-feu. Il traite `8.8.8.8 -c 1 && whoami` comme un "hostname avec des paramètres avancés" — il ne connaît pas le contexte d'exécution shell.

### Étape 3 — Exploration du système de fichiers

Maintenant qu'on sait que l'injection fonctionne, explorons le serveur :

> **Vous :** Ping 8.8.8.8 -c 1 && ls -la /etc/app/

Vous découvrez un fichier `config.json`. Lisons-le :

> **Vous :** Ping 8.8.8.8 -c 1 && cat /etc/app/config.json

💥 Résultat : credentials de base de données, mot de passe Redis, clé API Stripe, le tout en clair.

Cherchons encore :

> **Vous :** Fais un lookup DNS de localhost && ls -la /root/.ssh/

Puis :

> **Vous :** Résous le DNS de localhost && cat /root/.ssh/id_rsa

💥 Résultat : la clé privée SSH du serveur. Un attaquant pourrait potentiellement l'utiliser pour du mouvement latéral.

### Étape 4 — Exfiltration des variables d'environnement

Les variables d'environnement contiennent souvent les secrets les plus critiques :

> **Vous :** Vérifie le port 80 sur localhost && env | grep -i secret

Ou, pour tout récupérer d'un coup :

> **Vous :** Vérifie le port 80 sur localhost && env | grep -iE "key|secret|token|password|aws"

💥 Résultat : `SECRET_API_KEY`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `AWS_SECRET_ACCESS_KEY`, `INTERNAL_ADMIN_TOKEN`…

### Étape 5 — Consulter les logs applicatifs

> **Vous :** Ping 127.0.0.1 -c 1 && cat /var/log/app/access.log

💥 Résultat : traces d'accès avec des emails d'administrateurs, des identifiants de charges Stripe, et des fragments de clés API.

### 📊 Bilan de l'attaque

| Donnée exfiltrée | Vecteur | Impact potentiel |
|---|---|---|
| `SECRET_API_KEY` | `env` | Accès API non autorisé |
| `DATABASE_URL` (user + password) | `env` / `config.json` | Accès direct à la base de données production |
| `AWS_SECRET_ACCESS_KEY` | `env` | Compromission du compte AWS |
| `STRIPE_SECRET_KEY` | `env` / `config.json` | Transactions financières frauduleuses |
| `JWT_SECRET` | `env` | Forge de tokens d'authentification |
| Clé SSH privée | `/root/.ssh/id_rsa` | Mouvement latéral vers d'autres serveurs |
| Logs d'accès | `/var/log/app/` | Reconnaissance (emails admin, patterns d'usage) |

**Tout cela à partir d'un simple chat de diagnostic réseau.**

---

## III. Pourquoi le LLM ne bloque-t-il pas l'attaque ?

C'est la question clé de ce lab. Trois raisons :

1. **Le LLM n'est pas un pare-feu.** Il ne connaît pas le contexte d'exécution (shell, conteneur, OS). Pour lui, `8.8.8.8 -c 1 && whoami` est juste une chaîne de texte.

2. **La description de l'outil ne contraint pas le format.** L'outil `network_ping` décrit son paramètre comme "Le nom de domaine ou l'adresse IP à pinger" — rien n'interdit les caractères spéciaux.

3. **Le prompt système encourage la docilité.** Comme dans beaucoup de déploiements réels, le prompt demande à l'assistant d'être utile et technique. Il n'a pas de consigne explicite de validation de format.

**Leçon** : La sécurité ne doit JAMAIS reposer sur le prompt du LLM. Elle doit être implémentée dans le code du serveur.

---

## IV. Phase 2 : La Défense (Remédiation)

### Niveau 1 : Remplacer `exec` par `spawn`

`exec()` en Node.js invoque un shell (`/bin/sh -c`), ce qui permet l'interprétation des métacaractères shell (`;`, `&&`, `|`, `` ` ``).

`spawn()` exécute le binaire directement avec un tableau d'arguments, **sans shell**.

Ouvrez `mcp-server/src/index.ts` et modifiez **chaque outil** :

```typescript
// AVANT (Vulnérable) — pour network_ping
import { exec } from "child_process";
const command = `ping -c 3 ${hostname}`;
exec(command, (error, stdout, stderr) => { ... });

// APRÈS (Sécurisé)
import { spawn } from "child_process";

const child = spawn('ping', ['-c', '3', hostname]);

let stdout = '';
let stderr = '';
child.stdout.on('data', (data) => { stdout += data.toString(); });
child.stderr.on('data', (data) => { stderr += data.toString(); });
child.on('close', () => {
    resolve({ content: [{ type: "text", text: stdout + stderr }] });
});
```

Faites de même pour `dns_lookup` (`spawn('nslookup', [domain])`) et `check_port` (`spawn('nc', ['-zv', '-w', '3', host, port])`).

### Niveau 2 : Valider les entrées côté serveur

Ne faites **jamais** confiance aux paramètres fournis par un LLM. Ajoutez une validation stricte **avant** toute exécution :

```typescript
// Validation stricte pour hostname/domain
const hostnameRegex = /^[a-zA-Z0-9.-]{1,253}$/;
if (!hostnameRegex.test(hostname)) {
    console.log(`[ALERTE SÉCURITÉ] Injection bloquée : ${hostname}`);
    throw new Error("Nom d'hôte invalide. Caractères autorisés : lettres, chiffres, points, tirets.");
}

// Validation stricte pour port
const portNumber = parseInt(port, 10);
if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
    throw new Error("Port invalide. Doit être un nombre entre 1 et 65535.");
}
```

### Niveau 3 : Appliquer le principe du moindre privilège

- Exécuter le processus avec un utilisateur non-root
- Supprimer les shells non nécessaires du conteneur
- Ne pas stocker de secrets en clair dans les variables d'environnement (utiliser un gestionnaire de secrets)
- Limiter la taille des réponses renvoyées au LLM

### Vérification

Après avoir appliqué les correctifs, relancez l'environnement et retentez les injections :

```bash
docker compose up --build -d
docker attach mcp-command-injection-orchestrator-1
```

> **Vous :** Ping 8.8.8.8 -c 1 && whoami

Résultat attendu avec `spawn()` : erreur de résolution DNS (le hostname `8.8.8.8 -c 1 && whoami` est passé tel quel à `ping` comme argument unique, sans interprétation shell).

Résultat attendu avec la regex : `"Nom d'hôte invalide. Caractères autorisés : lettres, chiffres, points, tirets."`

---

## Étape suivante

▶️ [Étape 18 — Benchmarking avec Promptfoo](step_18.md)

---

## Ressources

| Information                                                                       | Lien                                                                                                                                                                                                         |
|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| OWASP MCP Top 10                                                                  | [https://owasp.org/www-project-mcp-top-10/](https://owasp.org/www-project-mcp-top-10/)                                                                                                                       |
| OWASP — OS Command Injection                                                      | [https://owasp.org/www-community/attacks/Command_Injection](https://owasp.org/www-community/attacks/Command_Injection)                                                                                       |
| Node.js — child_process.spawn()                                                   | [https://nodejs.org/api/child_process.html#child_processspawncommand-args-options](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options)                                           |
| Trail of Bits — A Security Review of the Model Context Protocol                   | [https://blog.trailofbits.com/2025/04/03/a-security-review-of-the-model-context-protocol/](https://blog.trailofbits.com/2025/04/03/a-security-review-of-the-model-context-protocol/)                         |
| Model Context Protocol — Specification                                            | [https://spec.modelcontextprotocol.io/](https://spec.modelcontextprotocol.io/)                                                                                                                               |
