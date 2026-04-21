#!/usr/bin/env bash
set -euo pipefail

REGISTRY_URL="${PYPI_REGISTRY:-https://pypi-registry.lab.benvii.com/root/pypi/+simple/}"
PYRIT_DIR="${PYRIT_DIR:-$HOME/Documents/Dev/PyRIT}"
REQUIREMENTS_TMP=$(mktemp /tmp/pyrit-requirements-XXXXXX.txt)
DOWNLOAD_TMP=$(mktemp -d /tmp/pyrit-seed-XXXXXX)
TMPVENV=$(mktemp -d)/venv

trap 'rm -f "$REQUIREMENTS_TMP"; rm -rf "$DOWNLOAD_TMP"; rm -rf "$(dirname "$TMPVENV")"' EXIT

echo "Seeding Python registry (devpi): $REGISTRY_URL"
echo "PyRIT source: $PYRIT_DIR"
echo ""

if [ ! -f "$PYRIT_DIR/uv.lock" ]; then
  echo "ERROR: uv.lock not found in $PYRIT_DIR" >&2
  exit 1
fi

# Vérifier que devpi est accessible avant de commencer
if ! curl -sf "${REGISTRY_URL%/root/*}" > /dev/null; then
  echo "ERROR: devpi registry is not reachable at $REGISTRY_URL" >&2
  echo "       Assurez-vous que docker compose up est lancé." >&2
  exit 1
fi

echo "-> Exporting pinned dependencies from uv.lock..."
(cd "$PYRIT_DIR" && uv export --frozen --no-dev --no-hashes --no-emit-project --output-file "$REQUIREMENTS_TMP")
printf '\nIPython\nsetuptools\nwheel\n' >> "$REQUIREMENTS_TMP"

echo "-> Creating temporary pip environment..."
uv venv --seed --quiet "$TMPVENV"
PIP="$TMPVENV/bin/pip"

# Les fichiers téléchargés localement sont jetés (DOWNLOAD_TMP).
# Le passage par devpi suffit à alimenter son cache interne.
download_for_platform() {
  local label=$1 platform=$2 python_ver=$3
  echo "   [$label] py${python_ver}"
  "$PIP" download \
    -r "$REQUIREMENTS_TMP" \
    -d "$DOWNLOAD_TMP" \
    --index-url "$REGISTRY_URL" \
    --platform "$platform" \
    --python-version "$python_ver" \
    --implementation cp \
    --abi "cp${python_ver}" \
    --only-binary :all: \
    --progress-bar off 2>&1 || true
}

echo "-> Pre-warming devpi cache (multi-platform)..."
for py_ver in 311 312; do
  download_for_platform "linux x86_64"   manylinux_2_17_x86_64  $py_ver
  download_for_platform "linux aarch64"  manylinux_2_17_aarch64 $py_ver
  download_for_platform "macos arm64"    macosx_14_0_arm64       $py_ver
  download_for_platform "macos x86_64"   macosx_13_0_x86_64      $py_ver
done

echo "-> Downloading sdists and pure-Python wheels (fallback pour packages sans wheel binaire)..."
"$PIP" download \
  -r "$REQUIREMENTS_TMP" \
  -d "$DOWNLOAD_TMP" \
  --index-url "$REGISTRY_URL" \
  --no-binary :all: \
  --progress-bar off 2>&1 || true

echo ""
echo "Done. Cache devpi pré-chargé — les packages manquants seront récupérés depuis PyPI à la demande."
