FROM node:22-slim

WORKDIR /app

# Install ping utility for the lab
RUN apt-get update && apt-get install -y iputils-ping && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

CMD ["npm", "start"]
