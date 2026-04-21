ARG BASE_NODE_IMAGE=node:22-slim
FROM ${BASE_NODE_IMAGE}
WORKDIR /app
COPY package*.json ./
ARG NPM_REGISTRY
RUN npm install ${NPM_REGISTRY:+--registry $NPM_REGISTRY}
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
