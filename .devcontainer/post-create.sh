#!/usr/bin/env bash
set -euo pipefail

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Pré-chauffe les images Docker des labs MCP au démarrage du codespace (post-prebuild).
# Le daemon Docker étant celui de l'hôte final (docker-outside-of-docker), ces images
# ne peuvent pas être cachées pendant le prebuild — on les build ici une seule fois
# pour que les participants n'aient pas à attendre.
echo "==> Building Docker images for MCP labs..."
MCP_COMPOSE_DIRS=(
  "mcp/mcp-command-injection"
  "mcp/mcp-poisoning"
  "mcp/mcp-rug-pull"
  "mcp/mcp-shadowing"
  "lab/agent-skill-supply-chain-exfiltration-server"
)

for dir in "${MCP_COMPOSE_DIRS[@]}"; do
  echo "  --> docker compose build: $dir"
  (cd "$WORKSPACE_ROOT/$dir" && docker compose build)
done

echo ""
echo "==> Environment ready!"
echo ""
echo "  Activate the venv with:  source .venv/bin/activate"
echo "  Then verify:             garak --version && python -c 'import pyrit; print(pyrit.__version__)'"
