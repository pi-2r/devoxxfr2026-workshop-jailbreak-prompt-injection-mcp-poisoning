FROM node:22-slim

WORKDIR /app

# Install network diagnostic utilities for the lab
RUN apt-get update && apt-get install -y iputils-ping dnsutils netcat-openbsd && rm -rf /var/lib/apt/lists/*

# --- Fichiers sensibles simulés (réalisme du lab) ---
RUN mkdir -p /etc/app /var/log/app /root/.ssh

RUN echo '{' > /etc/app/config.json && \
    echo '  "database": {' >> /etc/app/config.json && \
    echo '    "host": "db-internal.corp.net",' >> /etc/app/config.json && \
    echo '    "port": 5432,' >> /etc/app/config.json && \
    echo '    "username": "app_admin",' >> /etc/app/config.json && \
    echo '    "password": "Pr0d!xK9v",' >> /etc/app/config.json && \
    echo '    "database": "clients_production"' >> /etc/app/config.json && \
    echo '  },' >> /etc/app/config.json && \
    echo '  "redis": {' >> /etc/app/config.json && \
    echo '    "host": "redis-cache.corp.net",' >> /etc/app/config.json && \
    echo '    "password": "r3d1s_S3cur3!"' >> /etc/app/config.json && \
    echo '  },' >> /etc/app/config.json && \
    echo '  "api_keys": {' >> /etc/app/config.json && \
    echo '    "stripe": "sk_live_51NxR8KLm4BCdEfGhIjKlMnOp",' >> /etc/app/config.json && \
    echo '    "sendgrid": "SG.xYzAbCdEfGhIjKlMnOpQrSt"' >> /etc/app/config.json && \
    echo '  }' >> /etc/app/config.json && \
    echo '}' >> /etc/app/config.json

RUN echo '-----BEGIN OPENSSH PRIVATE KEY-----' > /root/.ssh/id_rsa && \
    echo 'b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz' >> /root/.ssh/id_rsa && \
    echo 'c2gtZWQyNTUxOQAAACBGakV4Q29kZUxhYkRldm94eEZSMjAyNl9GYWtlS2V5' >> /root/.ssh/id_rsa && \
    echo 'AAAAQFRoaXNJc05vdEFSZWFsS2V5SXRJc0ZvclRoZURldm94eEZSV29ya3No' >> /root/.ssh/id_rsa && \
    echo 'b3BTZWN1cml0eUxhYk9ubHkxMjM0NTY3ODkw' >> /root/.ssh/id_rsa && \
    echo '-----END OPENSSH PRIVATE KEY-----' >> /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa

RUN echo '2026-03-28 08:12:03 [INFO] Service started on port 3000' > /var/log/app/access.log && \
    echo '2026-03-28 08:12:05 [INFO] Connected to database db-internal.corp.net:5432' >> /var/log/app/access.log && \
    echo '2026-03-28 08:15:22 [INFO] GET /api/v1/clients - 200 - user=admin@corp.net' >> /var/log/app/access.log && \
    echo '2026-03-28 08:17:44 [WARN] Rate limit approaching for API key sk-proj-Dx8...7yLp' >> /var/log/app/access.log && \
    echo '2026-03-28 09:01:12 [INFO] POST /api/v1/payments - 201 - stripe_charge=ch_3NxR8K' >> /var/log/app/access.log && \
    echo '2026-03-28 09:23:55 [ERROR] Connection refused to redis-cache.corp.net:6379 - retrying' >> /var/log/app/access.log && \
    echo '2026-03-28 09:24:01 [INFO] Redis reconnected successfully' >> /var/log/app/access.log
# --- Fin fichiers sensibles ---

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ✅ Niveau 3 : Principe du moindre privilège
# Créer un utilisateur non-root pour exécuter l'application
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /usr/sbin/nologin appuser
RUN chown -R appuser:appuser /app

# Restreindre l'accès aux fichiers sensibles (l'utilisateur appuser ne peut plus les lire)
RUN chmod 700 /root/.ssh && \
    chmod 600 /etc/app/config.json && \
    chown root:root /etc/app/config.json && \
    chmod 640 /var/log/app/access.log && \
    chown root:root /var/log/app/access.log

# Supprimer les shells non nécessaires (durcissement)
RUN rm -f /bin/sh /bin/bash 2>/dev/null; ln -sf /usr/bin/dash /bin/sh

USER appuser

CMD ["npm", "start"]
