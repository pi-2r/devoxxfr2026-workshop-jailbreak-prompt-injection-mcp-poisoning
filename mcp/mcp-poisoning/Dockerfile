FROM node:22-slim

WORKDIR /app

# Installation globale de TypeScript pour ts-node
RUN npm install -g typescript ts-node

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Exposition du port Web 
EXPOSE 3000

# Commande de lancement (ts-node app.ts)
CMD ["npm", "start"]
