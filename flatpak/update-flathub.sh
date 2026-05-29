#!/usr/bin/env bash
set -euo pipefail

FLATPAK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${FLATPAK_DIR}/.." && pwd)"

FLATHUB_REPO="flathub/com.nuclearplayer.Nuclear"
MANIFEST="com.nuclearplayer.Nuclear.yml"
PNPM_REGISTRY="https://registry.npmjs.org/pnpm/-"

VERSION="$1"
TAG="player@${VERSION}"
BRANCH="flathub/v${VERSION}"

echo "Bumping ${FLATHUB_REPO} to ${TAG}"

COMMIT="$(git -C "${REPO_ROOT}" rev-list -n1 "${TAG}")"
echo "Resolved ${TAG} to commit ${COMMIT}"

PNPM_VERSION="$(node -p "require('${REPO_ROOT}/package.json').packageManager.split('@')[1]")"
PNPM_TARBALL="pnpm-${PNPM_VERSION}.tgz"
PNPM_URL="${PNPM_REGISTRY}/${PNPM_TARBALL}"
echo "pnpm version: ${PNPM_VERSION}"

PNPM_SHA256="$(curl -fsSL "${PNPM_URL}" | sha256sum | cut -d' ' -f1)"
echo "pnpm tarball sha256: ${PNPM_SHA256}"

WORKDIR="$(mktemp -d)"
trap 'rm -rf "${WORKDIR}"' EXIT

git clone "https://x-access-token:${GH_TOKEN}@github.com/${FLATHUB_REPO}.git" "${WORKDIR}"
git -C "${WORKDIR}" checkout -b "${BRANCH}"

"${FLATPAK_DIR}/generate-sources.sh" "${WORKDIR}"

export TAG COMMIT PNPM_VERSION PNPM_SHA256
envsubst '$TAG $COMMIT $PNPM_VERSION $PNPM_SHA256' \
  < "${FLATPAK_DIR}/${MANIFEST}.template" \
  > "${WORKDIR}/${MANIFEST}"

git -C "${WORKDIR}" config user.name nukeop
git -C "${WORKDIR}" config user.email 12746779+nukeop@users.noreply.github.com
git -C "${WORKDIR}" add -A
git -C "${WORKDIR}" commit -m "Update to ${VERSION}"
git -C "${WORKDIR}" push origin "${BRANCH}"

GH_TOKEN="${GH_TOKEN}" gh pr create \
  --repo "${FLATHUB_REPO}" \
  --head "${BRANCH}" \
  --base master \
  --title "Update to ${VERSION}" \
  --body "Automated update to ${TAG}."
