#!/usr/bin/env bash
set -euo pipefail

echo "==> [1/6] Installing global Node.js tools (TypeScript, ts-node)..."
npm install -g typescript ts-node

echo "==> [2/6] Installing Promptfoo..."
npm install -g promptfoo

echo "==> [3/6] Creating Python virtual-env with uv..."
cd /workspaces/"$(basename "$GITHUB_REPOSITORY" 2>/dev/null || basename "$(pwd)")"
uv venv --python 3.13 .venv
# shellcheck disable=SC1091
source .venv/bin/activate

echo "==> [4/6] Installing Garak..."
uv pip install garak==0.13.1

echo "==> [5/6] Cloning & installing PyRIT..."
PYRIT_DIR="/tmp/PyRIT"
if [ ! -d "$PYRIT_DIR" ]; then
  git clone https://github.com/Azure/PyRIT.git --depth 1 "$PYRIT_DIR"
fi
uv pip install --upgrade pip setuptools wheel
uv pip install IPython
uv pip install -e "$PYRIT_DIR"

echo "==> [6/6] Environment ready!"
echo ""
echo "  Activate the venv with:  source .venv/bin/activate"
echo "  Then verify:             garak --version && python -c 'import pyrit; print(pyrit.__version__)'"
