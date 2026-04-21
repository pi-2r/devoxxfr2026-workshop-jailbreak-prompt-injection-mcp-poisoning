# ⚡ Registries locales — fallback réseau (Wi-Fi LLM_ATTACK)

Cette approche alternative s'adresse :
* aux utilisateurs **ne pouvant pas utiliser Github codepsace**
* ayant Node.js ≥ 22, Docker d'installé

Nous vous conseillons d'être connecté au Wi-Fi **LLM_ATTACK** et d'utiliser les registries disponible en LAN sur ce 
réseau pour accélérer les téléchargements npm et docker, le réseau étant souvent saturé sur un événement.

Suivez les étapes suivantes.

## 1. Images Docker & packages npm dans les builds Docker

Copiez le template de configuration à la racine du dépôt :

```bash
cp .env.template .env.local
```

Ouvrez `.env.local` et décommentez les deux lignes suivantes :

```bash
BASE_NODE_IMAGE=docker-registry.lab.benvii.com/node:22-slim
NPM_REGISTRY=https://npm-registry.lab.benvii.com
```

Le `Makefile` de chaque lab charge automatiquement `.env.local` au lancement —
les builds Docker utiliseront alors la registry Docker locale et la registry npm
locale au lieu de Docker Hub / npmjs.com.

Lancez ensuite le lab via le `Makefile` (selon le lab : `make dev`, `make up`, etc.)
plutôt que directement avec `docker compose up --build` les Makefiles chargent les .env.local.

## 2. Packages npm pour les processus Node lancés hors Docker

Ouvrez le fichier `.npmrc` à la racine du dépôt et décommentez la ligne `registry=` :

```ini
registry=https://npm-registry.lab.benvii.com
```

> **Note :** cette ligne est déjà présente dans `.npmrc` — il suffit de retirer le `#` en début de ligne si elle est commentée.