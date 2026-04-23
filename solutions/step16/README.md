# Solutions — Step 17 : Command Injection (RCE) via MCP

Ce dossier contient les fichiers corrigés pour sécuriser le serveur MCP de diagnostic réseau.

## Fichiers

| Fichier | Description | Niveau de défense |
|---|---|---|
| `index.ts` | Serveur MCP sécurisé | Niveau 1 (spawn) + Niveau 2 (validation) |
| `Dockerfile` | Dockerfile durci | Niveau 3 (moindre privilège) |

## Comment appliquer les corrections

### Option 1 : Copier les fichiers

```bash
# Depuis la racine du projet
cp solutions/step17/index.ts mcp/mcp-command-injection/mcp-server/src/index.ts
cp solutions/step17/Dockerfile mcp/mcp-command-injection/mcp-server/Dockerfile
```

### Option 2 : Reconstruire et tester

```bash
cd mcp/mcp-command-injection
docker compose up --build -d
docker attach mcp-command-injection-orchestrator-1
```

## Résumé des corrections

### Niveau 1 — `exec()` → `spawn()`

- `exec()` invoque un shell (`/bin/sh -c`), permettant l'interprétation de `&&`, `;`, `|`, etc.
- `spawn()` exécute le binaire directement avec un tableau d'arguments, **sans shell**.
- Résultat : `8.8.8.8 -c 1 && whoami` est passé tel quel comme argument unique à `ping`, provoquant une erreur de résolution DNS au lieu d'exécuter `whoami`.

### Niveau 2 — Validation stricte des entrées

- Regex `^[a-zA-Z0-9.-]{1,253}$` pour les hostnames/domaines : bloque tout caractère spécial (`&&`, `;`, `|`, espaces, etc.)
- Validation numérique pour les ports (1-65535)
- Logs d'alerte sécurité en cas de tentative d'injection

### Niveau 3 — Principe du moindre privilège (Dockerfile)

- Exécution avec un utilisateur `appuser` non-root
- Restriction des permissions sur les fichiers sensibles (`/root/.ssh/`, `/etc/app/config.json`, logs)
- Même si l'injection passait, l'attaquant n'aurait plus accès aux secrets
