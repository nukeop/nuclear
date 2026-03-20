#!/usr/bin/env bash
# Generate offline dependency manifests for the Flatpak from-source build.
#
# Produces two files in the flatpak/ directory:
#   pnpm-sources.json   — npm packages referenced by pnpm-lock.yaml
#   cargo-sources.json   — Rust crates referenced by Cargo.lock
#
# Prerequisites:
#   flatpak-node-generator  (pipx install git+https://github.com/flatpak/flatpak-builder-tools.git#subdirectory=node)
#   python3                 (for the cargo generator)
#
# The cargo generator (flatpak-cargo-generator.py) is downloaded automatically
# from the flatpak-builder-tools repo if it isn't already cached locally.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CARGO_GENERATOR_URL="https://raw.githubusercontent.com/flatpak/flatpak-builder-tools/refs/heads/master/cargo/flatpak-cargo-generator.py"
CARGO_GENERATOR="$SCRIPT_DIR/.flatpak-cargo-generator.py"

# --- preflight checks --------------------------------------------------------

if ! command -v flatpak-node-generator &>/dev/null; then
  echo "Error: flatpak-node-generator not found." >&2
  echo "Install it with:  pipx install git+https://github.com/flatpak/flatpak-builder-tools.git#subdirectory=node" >&2
  exit 1
fi

if ! command -v python3 &>/dev/null; then
  echo "Error: python3 not found." >&2
  exit 1
fi

# --- cargo generator download ------------------------------------------------

if [ ! -f "$CARGO_GENERATOR" ]; then
  echo "Downloading flatpak-cargo-generator.py..."
  curl -fsSL "$CARGO_GENERATOR_URL" -o "$CARGO_GENERATOR"
fi

# --- generate pnpm sources ---------------------------------------------------

echo "Generating pnpm-sources.json..."
flatpak-node-generator pnpm \
  -o "$SCRIPT_DIR/pnpm-sources.json" \
  "$REPO_ROOT/pnpm-lock.yaml"

# --- generate cargo sources ---------------------------------------------------

echo "Generating cargo-sources.json..."
python3 "$CARGO_GENERATOR" \
  "$REPO_ROOT/packages/player/src-tauri/Cargo.lock" \
  -o "$SCRIPT_DIR/cargo-sources.json"

# --- summary ------------------------------------------------------------------

echo ""
echo "Generated:"
echo "  $SCRIPT_DIR/pnpm-sources.json"
echo "  $SCRIPT_DIR/cargo-sources.json"
