#!/usr/bin/env bash
set -euo pipefail

echo "==> [1/5] Installing global Node.js tools (TypeScript, ts-node, Promptfoo)..."
npm install -g typescript ts-node promptfoo

echo "==> [2/5] Creating Python virtual-env with uv..."
cd /workspaces/"$(basename "${GITHUB_REPOSITORY:-$(pwd)}")"
uv venv --python 3.13 .venv
# shellcheck disable=SC1091
source .venv/bin/activate

echo "==> [3/5] Installing Garak..."
uv pip install garak==0.13.1

echo "==> [4/5] Upgrading pip toolchain..."
uv pip install --upgrade pip setuptools wheel IPython

echo "==> [5/5] Cloning & installing PyRIT..."
PYRIT_DIR="/tmp/PyRIT"
if [ ! -d "$PYRIT_DIR" ]; then
  git clone https://github.com/Azure/PyRIT.git --depth 1 "$PYRIT_DIR"
fi
uv pip install -e "$PYRIT_DIR"

echo ""
echo "==> Pre-build steps complete!"