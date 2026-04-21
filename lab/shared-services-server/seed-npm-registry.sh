#!/usr/bin/env bash
set -euo pipefail

REGISTRY="${NPM_REGISTRY:-https://npm-registry.lab.benvii.com}"
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMPDIR_BASE=$(mktemp -d)

trap 'rm -rf "$TMPDIR_BASE"' EXIT

PROJECTS=(
  "mcp/mcp-command-injection/mcp-server"
  "mcp/mcp-command-injection/client"
  "mcp/mcp-poisoning"
  "mcp/mcp-rug-pull/mcp-server"
  "mcp/mcp-rug-pull/client-orchestrator"
  "mcp/mcp-shadowing/client"
  "mcp/mcp-shadowing/server-fintech"
  "mcp/mcp-shadowing/server-bank"
  "lab/agent-skill-supply-chain-exfiltration-server"
)

echo "Seeding npm registry: $REGISTRY"
echo "Repo root: $REPO_ROOT"
echo ""

for project in "${PROJECTS[@]}"; do
  dir="$REPO_ROOT/$project"
  if [ ! -f "$dir/package.json" ]; then
    echo "SKIP $project — package.json not found"
    continue
  fi

  echo "-> $project"
  tmpdir="$TMPDIR_BASE/$(echo "$project" | tr '/' '-')"
  mkdir -p "$tmpdir"
  cp "$dir/package.json" "$tmpdir/"
  (cd "$tmpdir" && npm install --registry "$REGISTRY" --prefer-online 2>&1 | tail -2)
done

echo ""
echo "Seeding platform-specific packages for linux/x64..."
echo ""

for project in "${PROJECTS[@]}"; do
  dir="$REPO_ROOT/$project"
  if [ ! -f "$dir/package.json" ]; then
    echo "SKIP $project — package.json not found"
    continue
  fi

  echo "-> $project (linux/x64)"
  tmpdir="$TMPDIR_BASE/linux-$(echo "$project" | tr '/' '-')"
  mkdir -p "$tmpdir"
  cp "$dir/package.json" "$tmpdir/"
  (cd "$tmpdir" && npm_config_os=linux npm_config_cpu=x64 npm install \
    --registry "$REGISTRY" --prefer-online 2>&1 | tail -2)
done

echo ""
echo "Done."