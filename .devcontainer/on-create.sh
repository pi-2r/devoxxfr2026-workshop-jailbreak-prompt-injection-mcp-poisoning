#!/usr/bin/env bash
set -euo pipefail

echo "==> [1/6] Installing global Node.js tools (TypeScript, ts-node, Promptfoo, Opencode)..."
npm install -g typescript ts-node promptfoo opencode-ai

echo "==> [2/6] Creating Python virtual-env with uv..."
cd /workspaces/"$(basename "${GITHUB_REPOSITORY:-$(pwd)}")"
echo "==> [2b/5] Installing uv..."
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# Clear venv if existing otherwise installation gets stuck as UV will ask the user that isn't able to respond
export UV_VENV_CLEAR=1
uv venv --python 3.13 .venv
# shellcheck disable=SC1091
source .venv/bin/activate

echo "==> [3/6] Installing Garak..."
uv pip install garak==0.13.1

echo "==> [4/6] Upgrading pip toolchain..."
uv pip install --upgrade pip setuptools wheel IPython

echo "==> [5/6] Cloning & installing PyRIT..."
PYRIT_DIR="/workspaces/PyRIT"
if [ ! -d "$PYRIT_DIR" ]; then
  git clone https://github.com/microsoft/PyRIT --depth 1 "$PYRIT_DIR"
fi
uv pip install -e "$PYRIT_DIR"

echo "==> [6/6] Installing & building all workshop Node.js packages..."
WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PACKAGES=(
  "mcp/mcp-command-injection/client"
  "mcp/mcp-command-injection/mcp-server"
  "mcp/mcp-poisoning"
  "mcp/mcp-rug-pull/client-orchestrator"
  "mcp/mcp-rug-pull/mcp-server"
  "mcp/mcp-shadowing/client"
  "mcp/mcp-shadowing/server-bank"
  "mcp/mcp-shadowing/server-fintech"
  "lab/agent-skill-supply-chain-exfiltration-server"
)

for pkg in "${PACKAGES[@]}"; do
  echo "  --> $pkg"
  (cd "$WORKSPACE_ROOT/$pkg" && npm install && npm run build)
done

echo ""
echo "==> Pre-build steps complete!"