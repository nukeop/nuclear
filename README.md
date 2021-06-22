# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![Maintainability](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) [![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/JqPjKxE)

Desktop music player focused on streaming from free sources

![Showcase](https://i.imgur.com/8qHu66J.png)

# Links

[Official website](https://nuclear.js.org)

[Downloads](https://github.com/nukeop/nuclear/releases)

[Documentation](https://nukeop.gitbook.io/nuclear/)

[Mastodon](https://mstdn.io/@nuclear)

[Twitter](https://twitter.com/nuclear_player)

Support channel (Matrix): `#nuclear:matrix.org`

Discord chat: https://discord.gg/JqPjKxE

Readme translations: 

<kbd>[<img title="Deutsch" alt="Deutsch" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/de.svg" width="22">](docs/README-de.md)</kbd>
<kbd>[<img title="Português" alt="Português" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/br.svg" width="22">](docs/README-ptbr.md)</kbd>
<kbd>[<img title="Svenska" alt="Svenska" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/se.svg" width="22">](docs/README-se.md)</kbd>
<kbd>[<img title="English" alt="English" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/us.svg" width="22">](README.md)</kbd>
<kbd>[<img title="Hebrew" alt="Hebrew" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/il.svg" width="22">](docs/README-he.md)</kbd>
<kbd>[<img title="Italiano" alt="Italiano" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/it.svg" width="22">](docs/README-it.md)</kbd>
<kbd>[<img title="Türkçe" alt="Türkçe" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/tr.svg" width="22">](docs/README-tr.md)</kbd>

## What is this?
nuclear is a free music streaming program that pulls content from free sources all over the internet.

If you know [mps-youtube](https://github.com/mps-youtube/mps-youtube), this is a similar music player but with a GUI.
It's also focusing more on audio. Imagine Spotify which you don't have to pay for and with a bigger library.

## What if I am religiously opposed to Electron?
See [this](docs/electron.md).

## Features

- Searching for and playing music from YouTube (including integration with playlists and [SponsorBlock](https://sponsor.ajay.app/)), Jamendo, Audius and SoundCloud
- Searching for albums (powered by Last.fm and Discogs), album view, automatic song lookup based on artist and track name (in progress, can be dodgy sometimes)
- Song queue, which can be exported as a playlist
- Loading saved playlists (stored in json files)
- Scrobbling to last.fm (along with updating the 'now playing' status)
- Newest releases with reviews - tracks and albums
- Browsing by genre
- Radio mode (automatically queue similar tracks)
- Unlimited downloads (powered by youtube)
- Realtime lyrics
- Browsing by popularity
- List of favorite tracks
- Listening from local library
- No accounts
- No ads
- No CoC
- No CLA

## Development process

First of all, be sure to check out the [Contribution Guidelines](https://nukeop.gitbook.io/nuclear/contributing/contribution-guidelines).

The instructions for running Nuclear in development mode can be found in the [Development Process](https://nukeop.gitbook.io/nuclear/developer-resources/development-process) document.

## Community-maintained packages

Here's a list of packages for various managers, some of which are maintained by third parties. We would like to thank the maintainers for their work.

| Package type   | Link                                                               | Maintainer                                   | Installation Method                           |
|:--------------:|:------------------------------------------------------------------:|:--------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/             | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-bin                     |
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-git              | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-git                     |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/                           | [JourneyOver](https://github.com/JourneyOver)| choco install nuclear                         |
| GURU (Gentoo)  | https://github.com/gentoo/guru/tree/master/media-sound/nuclear-bin | [scardracs](https://github.com/scardracs)    | emerge nuclear-bin                          |
| Homebrew (Mac) | https://formulae.brew.sh/cask/nuclear                              | Homebrew                                     | brew install --cask nuclear                   |
| Snap           | https://snapcraft.io/nuclear                                       | [nukeop](https://github.com/nukeop)          | sudo snap install nuclear                     |
| Flatpak        | https://flathub.org/apps/details/org.js.nuclear.Nuclear            | [nukeop](https://github.com/nukeop)          | flatpak install flathub org.js.nuclear.Nuclear|


## Community translations
Nuclear has already been translated to several languages, and we're always looking for contributors who would like to add more. Below is a list of currently available languages, along with contributors who helped to translate Nuclear to that language.

| Language             | Contributor                                                                                                 |
|:--------------------:|:-----------------------------------------------------------------------------------------------------------:|
| English              | N/A                                                                                                         |
| French               | [charjac](https://github.com/charjac), [Zalax](https://github.com/Zalaxx)                                   |
| Dutch                | [Vistaus](https://github.com/Vistaus)                                                                       |
| Danish               | [Hansen1992](https://github.com/Hansen1992)                                                                 |
| Spanish              | [mlucas94](https://github.com/mlucas94), [emlautarom1](https://github.com/emlautarom1)                      |
| Polish               | [kazimierczak-robert](https://github.com/kazimierczak-robert), [gradzka](https://github.com/gradzka)        |
| German               | [nuclear](https://github.com/nuclear), [schippas](https://github.com/schippas)                              |
| Russian              | [ramstore07](https://github.com/ramstore07), [dmtrshat](https://github.com/dmtrshat)                        |
| Brazilian Portuguese | [JoaoPedroMoraes](https://github.com/JoaoPedroMoraes)                                                       |
| Turkish              | [3DShark](https://github.com/3DShark)                                                                       |
| Italian              | [gello94](https://github.com/gello94), [scardracs](https://github.com/scardracs)                            |
| Slovak               | [MartinT](https://github.com/MartinTuroci)                                                                  |
| Czech                | [PetrTodorov](https://github.com/PetrTodorov)                                                               |
| Tagalog              | [giftofgrub](https://github.com/giftofgrub)                                                                 |
| Traditional Chinese  | [oxygen-TW](https://github.com/oxygen-TW)                                                                   |
| Swedish              | [PalleKarlsson](https://github.com/PalleKarlsson), [nonew-star](https://github.com/nonew-star)                                                           |
| Greek                | [Shuin-San](https://github.com/Shuin-San)                                                                   |
| Vietnamese           | [HaiDang666](https://github.com/HaiDang666)                                                                 |
| Finnish              | [cjola002-xamk](https://github.com/cjola002-xamk)                                                           |
| Korean               | [dexterastin](https://github.com/dexterastin), [teamzamong](https://github.com/teamzamong/)                 |

## Screenshots
This will be updated as the program evolves.

![Album Search](https://i.imgur.com/idFVnAF.png)

![Album Display](https://i.imgur.com/Kvzo3q7.png)

![Artist View](https://i.imgur.com/imBLYl3.png)

![Dashboard Best New Music](https://i.imgur.com/bMDrR4M.png)

![Dashboard Genres](https://i.imgur.com/g0aCmKx.png)

![Playlist View](https://i.imgur.com/2VMXHDC.png)

![Lyrics View](https://i.imgur.com/7e3DJKJ.png)

![Equalizer View](https://i.imgur.com/WreRL0w.png)

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
