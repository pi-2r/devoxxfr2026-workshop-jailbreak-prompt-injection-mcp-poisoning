# Lab LAN shared services server

🚨 Réservé aux animateurs du lab il s'agit des infos nécessaires pour lancer des services partagés / backup / plan B
pendant le lab :
* Playground Microsoft
* Registry docker locale avec SSL : https://docker-registry.lab.benvii.com
* Registry NPM local avec SSL : https://npm-registry.lab.benvii.com
* Serveur code-server : https://code-server.lab.benvii.com

## Pré-charger les packages npm dans la registry locale

```bash
./seed-npm-registry.sh
```

Le script installe les dépendances (directes + transitives) de tous les projets du workshop via Verdaccio, qui les met en cache. Les participants peuvent ensuite faire leurs `npm install` sans accès internet :

```bash
npm install --registry https://npm-registry.lab.benvii.com
```

## Pré-charger une image dans la registry locale

```bash
# 1. Pull depuis Docker Hub
docker pull node:22-slim

# 2. Re-tag vers la registry locale
docker tag node:22-slim docker-registry.lab.benvii.com/node:22-slim

# 3. Push
docker push docker-registry.lab.benvii.com/node:22-slim
```

Les participants peuvent ensuite utiliser l'image sans accès internet :

```bash
docker pull docker-registry.lab.benvii.com/node:22-slim
```

