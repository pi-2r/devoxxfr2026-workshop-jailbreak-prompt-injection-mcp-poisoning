#!/usr/bin/env bash
# Génère docker-compose.yml à partir de users.txt
# Usage : ./generate.sh [MAX_USERS] [users.txt]
#   MAX_USERS : nombre max d'utilisateurs à inclure (défaut : tous).
#               Prend les N premières lignes valides du fichier.
#   users.txt : chemin du fichier users (défaut : users.txt).
#
# Chaque utilisateur est accessible via : https://<username>.<DOMAIN>
# Configurer DOMAIN dans .env (ex : DOMAIN=code.lab.benvii.com)
set -euo pipefail

MAX_USERS="${1:-}"
USERS_FILE="${2:-users.txt}"
OUTPUT="docker-compose.yml"

if [[ -n "$MAX_USERS" && ! "$MAX_USERS" =~ ^[0-9]+$ ]]; then
  echo "Erreur : MAX_USERS doit être un entier (reçu : '$MAX_USERS')." >&2
  exit 1
fi

if [[ ! -f "$USERS_FILE" ]]; then
  echo "Erreur : fichier '$USERS_FILE' introuvable." >&2
  exit 1
fi

# Collecte des (username, password) filtrés + limités — utilisé deux fois
# (services puis volumes) pour garantir la cohérence.
USERS=()
while IFS= read -r line; do
  [[ -z "$line" || "$line" == \#* ]] && continue
  USERS+=("$line")
  if [[ -n "$MAX_USERS" && "${#USERS[@]}" -ge "$MAX_USERS" ]]; then
    break
  fi
done < "$USERS_FILE"

# ── En-tête + Traefik ────────────────────────────────────────────────────────
# Traefik n'expose plus de ports sur l'hôte — il est atteint par Caddy
# (stack shared-services-server) via le réseau externe `lab_edge`.
# La stack shared-services-server doit être démarrée en premier (elle crée le réseau).
cat > "$OUTPUT" << 'YAML'
# Généré automatiquement par generate.sh — ne pas éditer manuellement
# Pour modifier : éditez users.txt puis relancez ./generate.sh

services:

  traefik:
    image: traefik:v3
    container_name: traefik
    command:
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      # Désactiver les timeouts pour les WebSockets long-lived de code-server
      - --entrypoints.web.transport.respondingTimeouts.readTimeout=0
      - --entrypoints.web.transport.respondingTimeouts.writeTimeout=0
      - --entrypoints.web.transport.respondingTimeouts.idleTimeout=0
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - default
      - lab_edge
    restart: unless-stopped

YAML

# ── Services utilisateurs ────────────────────────────────────────────────────
count=0
for line in "${USERS[@]}"; do
  IFS=: read -r username password <<< "$line"

  mkdir -p "users/${username}/workspace"

  cat >> "$OUTPUT" << YAML
  code-${username}:
    build: .
    container_name: code-${username}
    platform: linux/arm64
    environment:
      - PASSWORD=${password}
    entrypoint: ["/usr/local/bin/init.sh"]
    volumes:
      - code-${username}-data:/home/coder/.local/share/code-server
      - ./users/${username}/workspace:/home/coder/workspace
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${username}.rule=Host(\`${username}.\${DOMAIN:-localhost}\`)"
      - "traefik.http.services.${username}.loadbalancer.server.port=8080"
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: "1.0"
    restart: unless-stopped

YAML

  ((count++))
done

# ── Réseau externe (créé par la stack shared-services-server) ────────────────
cat >> "$OUTPUT" << 'YAML'
networks:
  lab_edge:
    external: true

YAML

# ── Volumes nommés (user-data hors overlay FS) ───────────────────────────────
echo "volumes:" >> "$OUTPUT"
for line in "${USERS[@]}"; do
  IFS=: read -r username _ <<< "$line"
  echo "  code-${username}-data:" >> "$OUTPUT"
done

echo ""
echo "✓ $OUTPUT généré : $count utilisateur(s)"
echo ""
echo "  Accès : https://<username>.\${DOMAIN}  (via Caddy, stack shared-services-server)"
echo "  → Configurez DOMAIN dans .env (ex : DOMAIN=code.lab.benvii.com)"
echo ""
echo "  Prérequis : la stack shared-services-server doit être démarrée en premier"
echo "              (elle crée le réseau externe lab_edge)."
echo ""
echo "  Démarrer  : docker compose up -d"
echo "  Arrêter   : docker compose down"
echo "  Logs user : docker compose logs -f code-<username>"
