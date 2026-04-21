ARG BASE_NODE_IMAGE=node:22-slim
FROM ${BASE_NODE_IMAGE}

WORKDIR /app

ARG NPM_REGISTRY
# Installation globale de TypeScript pour ts-node
RUN npm install -g typescript ts-node ${NPM_REGISTRY:+--registry $NPM_REGISTRY}

# Installation des dépendances
COPY package*.json ./
RUN npm install ${NPM_REGISTRY:+--registry $NPM_REGISTRY}

# Copie du code source
COPY . .

# Exposition du port Web 
EXPOSE 3000

# Commande de lancement (ts-node app.ts)
CMD ["npm", "start"]
