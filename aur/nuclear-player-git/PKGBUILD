# Maintainer: nukeop

pkgname=nuclear-player-git
_pkgname=nuclear-player
pkgver=
pkgrel=1
pkgdesc='Nuclear is a free, open-source music player without ads or tracking.'
arch=(x86_64)
url='https://nuclearplayer.com'
license=('AGPL-3.0-only')
provides=('nuclear-player')
conflicts=('nuclear-player' 'nuclear-player-bin')
depends=('webkit2gtk-4.1' 'gtk3' 'hicolor-icon-theme' 'gst-plugins-base' 'gst-plugins-good')
optdepends=(
    'gst-plugins-bad: Additional media codec support'
    'gst-plugins-ugly: Patented codec support'
    'gst-libav: FFmpeg-based codec support'
)
makedepends=('git' 'cargo' 'nodejs' 'openssl' 'libappindicator-gtk3' 'librsvg')
source=("${pkgname}::git+https://github.com/nukeop/nuclear.git")
sha256sums=('SKIP')

pkgver() {
    cd "${pkgname}"
    git describe --long --tags 2>/dev/null \
        | sed 's/^player@//;s/\([^-]*-g\)/r\1/;s/-/./g' \
        || printf "r%s.%s" "$(git rev-list --count HEAD)" "$(git rev-parse --short=7 HEAD)"
}

prepare() {
    cd "${pkgname}"
    corepack enable
    corepack prepare pnpm@latest --activate
    pnpm install
    cd packages/player/src-tauri
    cargo fetch --locked --target "$(rustc -vV | sed -n 's/host: //p')"
}

build() {
    cd "${pkgname}"
    export CFLAGS+=" -ffat-lto-objects"
    export CXXFLAGS+=" -ffat-lto-objects"
    pnpm --filter @nuclearplayer/player build:frontend
    cd packages/player/src-tauri
    cargo build --release
}

package() {
    cd "${pkgname}"
    install -Dm755 "packages/player/src-tauri/target/release/nuclear-music-player" \
        "${pkgdir}/usr/bin/nuclear-music-player"
    install -Dm644 "packages/player/src-tauri/resources/com.nuclearplayer.Nuclear.desktop" \
        "${pkgdir}/usr/share/applications/com.nuclearplayer.Nuclear.desktop"
    install -Dm644 "packages/player/src-tauri/icons/icon.png" \
        "${pkgdir}/usr/share/icons/hicolor/512x512/apps/com.nuclearplayer.Nuclear.png"
    install -Dm644 LICENSE \
        "${pkgdir}/usr/share/licenses/${_pkgname}/LICENSE"
}
