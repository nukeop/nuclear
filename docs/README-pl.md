# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/JqPjKxE)

Desktopowy odtwarzacz muzyki skoncentrowany na streamingu z otwartych źródeł

![Showcase](https://i.imgur.com/8qHu66J.png)

# Linki

[Oficjalna strona](https://nuclearplayer.com)

[Pliki do pobrania](https://github.com/nukeop/nuclear/releases)

[Dokumentacja](https://nukeop.gitbook.io/nuclear/)

[Mastodon](https://fosstodon.org/@nuclearplayer)

[Twitter](https://twitter.com/nuclear_player)

Potrzebujesz pomocy? Wejdź na kanał (Matrix): `#nuclear:matrix.org`

Discord chat: https://discord.gg/JqPjKxE

Zgłaszaj i głosuj na nowe funkcjonalności: https://nuclear.featureupvote.com/

Tłumaczenia Readme

<kbd>[<img title="Deutsch" alt="Deutsch" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/de.svg" width="22">](docs/README-de.md)</kbd>
<kbd>[<img title="Português" alt="Português" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/br.svg" width="22">](docs/README-ptbr.md)</kbd>
<kbd>[<img title="Svenska" alt="Svenska" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/se.svg" width="22">](docs/README-se.md)</kbd>
<kbd>[<img title="English" alt="English" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/us.svg" width="22">](README.md)</kbd>
<kbd>[<img title="Hebrew" alt="Hebrew" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/il.svg" width="22">](docs/README-he.md)</kbd>
<kbd>[<img title="Italiano" alt="Italiano" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/it.svg" width="22">](docs/README-it.md)</kbd>
<kbd>[<img title="Türkçe" alt="Türkçe" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/tr.svg" width="22">](docs/README-tr.md)</kbd>
<kbd>[<img title="Español" alt="Español" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/es.svg" width="22">](docs/README-es.md)</kbd>
<kbd>[<img title="Indonesia" alt="Indonesia" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/id.svg" width="22">](docs/README-id.md)</kbd>
<kbd>[<img title="Français" alt="Français" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/fr.svg" width="22">](docs/README-fr.md)</kbd>
<kbd>[<img title="Chinese" alt="Chinese" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/cn.svg" width="22">](docs/README-zh-cn.md)</kbd>
<kbd>[<img title="Russian" alt="Russian" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/ru.svg" width="22">](docs/README-ru.md)</kbd>
<kbd>[<img title="Polish" alt="Polish" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/pl.svg" width="22">](docs/README-pl.md)</kbd>

## Co to jest?
nuclear jest darmowym i wolnym oprogramowaniem do streamowania muzyki z darmowych źródeł z całego Internetu.

Jeśli znasz [mps-youtube](https://github.com/mps-youtube/mps-youtube), to jest podobny program tylko, że z GUI.
Skupia się również bardziej na audio. Wyobraź sobie Spotify'a za którego nie musisz płacić i z większą biblioteką.

## Co jeśli religijnie jestem przeciwko Electronowi?
Zobacz [to](docs/electron.md).

## Funkcjonalności

- Szukanie i odtwarzanie muzyki z YouTube'a (włącznie z integracją z playlistami z rozszerzeniem [SponsorBlock](https://sponsor.ajay.app/)), Jamendo, Audius i SoundCloud)
- Wyszukiwanie albumów ( dzięki Last.fm i Discogs), widok albumu, automatyczne wyszukiwanie piosenek na podstawie artysty i nazwy piosenki ( w trakcie implementacji, może czasami nie do końca działać poprawnie )
- Kolejka piosenek, które mogą być eksportowane jako playlisty
- Import zapisanych playlist ( zapisywanych w formacie json )
- Raportowanie do last.fm ( razem z aktualizacją statusu 'now playing')
- Najnowsze premiery z recenzjami - piosenki i albumy
- Przeglądanie według gatunku
- Tryb radia (automatyczne uzupełnianie kolejki z podobnymi piosenkami)
- Nielimitowana ilość pobrań (z youtube)
- Teksty piosenek w czasie rzeczywistym
- Przeglądanie pod względem popularności
- Lista ulubionych piosenek
- Słuchanie z lokalnej biblioteki
- Bez żadnych kont
- Bez żadnych reklam
- Bez Coc
- Bez CLA

## Kontrybucje

Najpierw upewnij się, żeby sprawdzić [Contribution Guidelines](https://nukeop.gitbook.io/nuclear/contributing/contribution-guidelines).

Instrukcje jak uruchomić Nuclear w trybie dewelopera można znaleźć w [Development Process](https://nukeop.gitbook.io/nuclear/developer-resources/development-process) .

## Pakiety utrzymywane przez społeczność

Poniżej znajduje się lista pakietów dla różnych menedżerów pakietów, niektóre z nich są utrzymywane przez strony trzecie. Chcielibyśmy podziękować
mainteinerom za ich pracę.

|  Typ pakietu  | Link                                                               | Maintainer                                   |  Sposób instalacji                           |
|:--------------:|:------------------------------------------------------------------:|:--------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/             | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-bin                     |
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-git              | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-git                     |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/                           | [JourneyOver](https://github.com/JourneyOver)| choco install nuclear                         |
| GURU (Gentoo)  | https://github.com/gentoo/guru/tree/master/media-sound/nuclear-bin | Orphaned    | emerge nuclear-bin                            |
| Homebrew (Mac) | https://formulae.brew.sh/cask/nuclear                              | Homebrew                                     | brew install --cask nuclear                   |
| Snap           | https://snapcraft.io/nuclear                                       | [nukeop](https://github.com/nukeop)          | sudo snap install nuclear                     |
| Flatpak        | https://flathub.org/apps/details/org.js.nuclear.Nuclear            | [nukeop](https://github.com/nukeop)          | flatpak install flathub org.js.nuclear.Nuclear|
| Void Linux     | https://github.com/machadofguilherme/nuclear-template              | [machadofguilherme](https://github.com/machadofguilherme) | See readme


## Tłumaczenia społeczności
Nuclear został przetłumaczony na wiele języków i ciągle szukamy nowych kontrybutorów, którzy chcieliby dodać jeszcze więcej tłumaczeń.

Korzystamy z  [Crowdin](https://crowdin.com/project/nuclear) aby usprawnić lokalizację. Możesz sprawdzić czy twój język jest wspierany i jaki jest postęp tłumaczenia oraz pomóc tłumaczyć Nuclear.

## Zrzuty ekranu

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

## Licencja

Ten program jest wolnym oprogramowaniem: możesz go redystrybuować i modyfikować wedle postanowień z licencji GNU Affero General Public License opublikowanej przez Free Software Foundation w wersji 3 lub późniejszej.

## Przypisy
Nuclear korzysta ze SponsorBlock [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) z https://sponsor.ajay.app/.
