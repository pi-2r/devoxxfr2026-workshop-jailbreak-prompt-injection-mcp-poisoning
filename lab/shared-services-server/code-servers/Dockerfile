FROM codercom/code-server:latest

USER root

# Install Node.js 22.x (LTS) + TypeScript global
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g typescript \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Script d'initialisation (permissions + settings par défaut)
COPY init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

USER coder
