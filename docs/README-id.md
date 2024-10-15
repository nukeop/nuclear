# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/JqPjKxE)

Aplikasi pemutar musik berbasis desktop yang berfokus pada streaming dari sumber gratis.

![Showcase](https://i.imgur.com/8qHu66J.png)

# Daftar Tautan

[Website Resmi](https://nuclearplayer.com)

[Unduh](https://github.com/nukeop/nuclear/releases)

[Dokumentasi](https://nukeop.gitbook.io/nuclear/)

[Mastodon](https://fosstodon.org/@nuclearplayer)

[Twitter](https://twitter.com/nuclear_player)

Dukungan kanal (Matrix): `#nuclear:matrix.org`

Chat Discord : https://discord.gg/JqPjKxE

Terjemahan : 

<kbd>[<img title="Deutsch" alt="Deutsch" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/de.svg" width="22">](docs/README-de.md)</kbd>
<kbd>[<img title="Português" alt="Português" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/br.svg" width="22">](docs/README-ptbr.md)</kbd>
<kbd>[<img title="Svenska" alt="Svenska" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/se.svg" width="22">](docs/README-se.md)</kbd>
<kbd>[<img title="English" alt="English" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/us.svg" width="22">](README.md)</kbd>
<kbd>[<img title="Hebrew" alt="Hebrew" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/il.svg" width="22">](docs/README-he.md)</kbd>
<kbd>[<img title="Italiano" alt="Italiano" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/it.svg" width="22">](docs/README-it.md)</kbd>
<kbd>[<img title="Türkçe" alt="Türkçe" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/tr.svg" width="22">](docs/README-tr.md)</kbd>
<kbd>[<img title="Español" alt="Español" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/es.svg" width="22">](docs/README-es.md)</kbd>
<kbd>[<img title="Français" alt="Français" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/fr.svg" width="22">](docs/README-fr.md)</kbd>

## Apa itu Nuclear?
Nuclear adalah aplikasi pemutar musik gratis yang mengambil konten dari semua sumber yang ada di internet.

Jika Anda pernah mendengar pemutar [mps-youtube](https://github.com/mps-youtube/mps-youtube), Nuclear merupakan aplikasi yang sama, namun memiliki GUI.
Nuclear juga lebih berfokus ke _audio_. Bayangkan saja bahwa Nuclear adalah aplikasi pemutar musik Spotify, namun bedanya Anda tidak perlu membayar dan jumlah koleksi musik di sini jauh lebih besar.

## Bagaimana jika Saya "secara agama/keyakinan tidak sepaham dengan elektron"?
Lihat [ini](docs/electron.md).

## Fitur

- Pencarian dan pemutaran lagu dari YouTube (termasuk integrasi _playlist_ dan [SponsorBlock](https://sponsor.ajay.app/), Jamendo, Audius dan SoundCloud
- Pencarian album (lewat Last.fm dan Discogs), melihat album, mencari lagu otomatis berdasarkan musisi dan judul lagu (sedang dalam tahap pengembangan, kadang tidak berjalan sesuai harapan)
- _Queue_ lagu, yang bisa diekspor sebagai _playlist_
- Memuat _playlist_ yang tersimpan (disimpan dalam json file)
- _Scrobbling_ lewat last.fm (serta meng-_update_ status 'sedang memutar' lagu tertentu)
- Rilisan terbaru, lengkap beserta _review_ lagu dan albumnya
- Pencarian berdasarkan _genre_
- Mode radio (otomatis melakukan _queue_ lagu yang mirip)
- Unduh tak terhingga (lewat YouTube)
- Timing lagu dan lirik yang tepat
- Pencarian berdasarkan popularitas
- _List_ lagu favorit
- Dengarkan lewat daftar koleksi
- Tanpa akun
- Tanpa iklan
- Tanpa CoC
- Tanpa CLA

## Proses Pengembangan

Pertama, pastikan membaca [Petunjuk Berkontribusi](https://nukeop.gitbook.io/nuclear/contributing/contribution-guidelines).

Instruksi untuk menjalankan Nuclear dalam mode pengembangan dapat dibaca di [Proses Pengembangan](https://nukeop.gitbook.io/nuclear/developer-resources/development-process)

## Packages Yang Dikelola Komunitas

Berikut adalah _list packages managers_, yang sebagian dikelola oleh pihak ketiga. Kami berterima kasih kepada para pengelola atas hasil kerjanya.

| Tipe Packages   | Tautan                                                               | Pengelola                                   | Metode Instalasi                           |
|:--------------:|:------------------------------------------------------------------:|:--------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/             | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-bin                     |
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-git              | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-git                     |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/                           | [JourneyOver](https://github.com/JourneyOver)| choco install nuclear                         |
| GURU (Gentoo)  | https://github.com/gentoo/guru/tree/master/media-sound/nuclear-bin | Orphaned    | emerge nuclear-bin                            |
| Homebrew (Mac) | https://formulae.brew.sh/cask/nuclear                              | Homebrew                                     | brew install --cask nuclear                   |
| Snap           | https://snapcraft.io/nuclear                                       | [nukeop](https://github.com/nukeop)          | sudo snap install nuclear                     |
| Flatpak        | https://flathub.org/apps/details/org.js.nuclear.Nuclear            | [nukeop](https://github.com/nukeop)          | flatpak install flathub org.js.nuclear.Nuclear|
| Void Linux     | https://github.com/machadofguilherme/nuclear-template              | [machadofguilherme](https://github.com/machadofguilherme) | Lihat readme

## Terjemahan Bahasa Dari Komunitas
Nuclear telah diterjemahkan ke beberapa bahasa, dan kami akan terus mencari kontributor yang selalu ingin berkontribusi.

Kami menggunakan _platform_ [Crowdin](https://crowdin.com/project/nuclear) untuk mengelola alih bahasa. Anda bisa mengecek apakah bahasa yang Anda gunakan telah tersedia di sana, melihat proses alih bahasa, dan bahkan membantu kami menerjemahkan Nuclear.

## Tangkapan Layar

![Default](../screenshots/screenshot_default.jpg)

![Dashboard](../screenshots/screenshot_dashboard.jpg)

![Album](../screenshots/screenshot_album.jpg)

![Artist](../screenshots/screenshot_artist.jpg)

![Search](../screenshots/screenshot_search.jpg)

![Command palette](../screenshots/screenshot_command_palette.jpg)

![Equalizer](../screenshots/screenshot_equalizer.jpg)

![Genres](../screenshots/screenshot_genres.jpg)

![Playlist](../screenshots/screenshot_playlist.jpg)

![Settings](../screenshots/screenshot_settings.jpg)

![Visualizer](../screenshots/screenshot_visualizer.jpg)

## Lisensi

Program ini merupakan perangkat lunak gratis: Anda dapat mendistribusikannya atau memodifikasi di bawah aturan GNU Affero General Public License yang dipublikasikan oleh Free Software Foundation, terlepas versi 3 lisensi, atau versi setelahnya sesuai pilihan anda.

## Atribusi
Menggunakan data SponsorBlock di bawah [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) dari https://sponsor.ajay.app/.
