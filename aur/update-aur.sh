#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE="${SCRIPT_DIR}/nuclear-player-bin/PKGBUILD.template"
WORK_DIR="/tmp/nuclear-aur-bin"

VERSION=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --version) VERSION="$2"; shift 2 ;;
        --dry-run) DRY_RUN=true; shift ;;
        *) echo "Usage: $0 --version <version> [--dry-run]"; exit 1 ;;
    esac
done

[[ -z "${VERSION}" ]] && { echo "Usage: $0 --version <version> [--dry-run]"; exit 1; }

DEB_URL="https://github.com/nukeop/nuclear/releases/download/player@${VERSION}/Nuclear_${VERSION}_amd64.deb"

export PKGVER="${VERSION}"
export SHA256SUM=$(curl -fSL "${DEB_URL}" | sha256sum | cut -d' ' -f1)

rm -rf "${WORK_DIR}"
mkdir -p "${WORK_DIR}"
envsubst '$PKGVER $SHA256SUM' < "${TEMPLATE}" > "${WORK_DIR}/PKGBUILD"
(cd "${WORK_DIR}" && makepkg --printsrcinfo > .SRCINFO)

if [[ "${DRY_RUN}" == true ]]; then
    cat "${WORK_DIR}/PKGBUILD"
    echo "---"
    cat "${WORK_DIR}/.SRCINFO"
    exit 0
fi

AUR_REPO="/tmp/nuclear-aur-repo"
rm -rf "${AUR_REPO}"
git clone ssh://aur@aur.archlinux.org/nuclear-player-bin.git "${AUR_REPO}"
cp "${WORK_DIR}/PKGBUILD" "${WORK_DIR}/.SRCINFO" "${AUR_REPO}/"
cd "${AUR_REPO}"
git add PKGBUILD .SRCINFO
git diff --cached --quiet && { echo "Already up to date."; exit 0; }
git -c user.name="nukeop" -c user.email="noreply@nuclearplayer.com" \
    commit -m "Update to ${VERSION}"
git push origin master
