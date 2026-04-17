#!/usr/bin/env bash
set -euo pipefail

echo "==> Upgrading Continue extension to pre-release..."
code --install-extension Continue.continue --pre-release

echo ""
echo "==> Environment ready!"
echo ""
echo "  Activate the venv with:  source .venv/bin/activate"
echo "  Then verify:             garak --version && python -c 'import pyrit; print(pyrit.__version__)'"