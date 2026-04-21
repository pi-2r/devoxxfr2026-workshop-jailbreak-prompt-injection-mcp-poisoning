ARG BASE_NODE_IMAGE=node:20-alpine
FROM ${BASE_NODE_IMAGE}

WORKDIR /app

COPY package*.json ./
ARG NPM_REGISTRY
RUN npm install ${NPM_REGISTRY:+--registry $NPM_REGISTRY}

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
