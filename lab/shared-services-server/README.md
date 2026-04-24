# Lab LAN shared services server

🚨 Réservé aux animateurs du lab il s'agit des infos nécessaires pour lancer des services partagés / backup / plan B
pendant le lab :
* Playground Microsoft
* Registry docker locale avec SSL : https://docker-registry.lab.benvii.com
* Registry NPM local avec SSL : https://npm-registry.lab.benvii.com
* Registry Python locale avec SSL : https://pypi-registry.lab.benvii.com
* Code-servers participants : https://&lt;prenom&gt;.code.lab.benvii.com (voir `code-servers/`)

> Cette stack crée le réseau Docker externe `lab_edge` utilisé par `code-servers/` pour exposer son Traefik derrière Caddy. **Démarrer cette stack en premier.**

## Pré-charger les packages npm dans la registry locale

```bash
./seed-npm-registry.sh
```

Le script installe les dépendances (directes + transitives) de tous les projets du workshop via Verdaccio, qui les met en cache. Les participants peuvent ensuite faire leurs `npm install` sans accès internet :

```bash
npm install --registry https://npm-registry.lab.benvii.com
```

## Pré-charger les packages Python dans la registry locale (devpi)

La registry Python utilise **devpi** en mode pull-through proxy : elle met en cache tout ce qui transite par elle et retombe sur PyPI pour ce qui manque.

**Démarrer la stack d'abord**, puis lancer le seed :

```bash
docker compose up -d
./seed-python-registry.sh
```

Le script pré-chauffe le cache devpi en téléchargeant les dépendances pincées de PyRIT (via `uv.lock`)
pour 4 plateformes × Python 3.11 et 3.12. Les packages non présents en cache seront récupérés sur
PyPI à la demande (tant qu'internet est disponible).

Les participants peuvent ensuite installer :

```bash
# Depuis le venv du lab, dans le dossier PyRIT cloné
UV_INDEX_URL=https://pypi-registry.lab.benvii.com/root/pypi/+simple/ uv pip install -e .
```

Le dossier PyRIT peut être configuré via `PYRIT_DIR` (défaut : `$HOME/Documents/Dev/PyRIT`) :

```bash
PYRIT_DIR=/chemin/vers/PyRIT ./seed-python-registry.sh
```

## Pré-charger une image dans la registry locale (multi-platform)

Utiliser `buildx imagetools` pour copier le manifest multi-arch complet (amd64, arm64…) en une seule commande :

```bash
docker buildx imagetools create \
  --tag docker-registry.lab.benvii.com/node:22-slim \
  node:22-slim
```

Les participants peuvent ensuite utiliser l'image sans accès internet, quelle que soit leur architecture :

```bash
docker pull docker-registry.lab.benvii.com/node:22-slim
```

