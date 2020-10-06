# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![Maintainability](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) [![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) ![Travis](https://api.travis-ci.org/nukeop/nuclear.svg?branch=master)

Desktop music player focused on streaming from free sources

![Showcase](https://i.imgur.com/G9BqIHl.png)

# Links

[Official website](https://nuclear.js.org)

[Mastodon](https://mstdn.io/@nuclear)

[Twitter](https://twitter.com/nuclear_player)

Support channel (Matrix): `#nuclear:matrix.org`

Discord channel: https://discord.gg/JqPjKxE

Readme translations: 
* [Brazilian Portuguese](docs/README-ptbr.md)
* [Swedish](docs/README-se.md)

## What is this?
nuclear is a free music streaming program that pulls content from free sources all over the internet.

If you know [mps-youtube](https://github.com/mps-youtube/mps-youtube), this is a similar music player but with a GUI.
It's also focusing more on audio. Imagine Spotify which you don't have to pay for and with a bigger library.

## What if I am religiously opposed to Electron?
See [this](docs/electron.md).

## Features

- Searching for and playing music from YouTube (including integration with playlists), Jamendo, Audius and SoundCloud
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

## Manual and docs
https://nuclearmusic.rtfd.io/

## Community-maintained packages

Here's a list of packages for various managers, most of which are maintained by third parties. We would like to thank the maintainers for their work.

| Package type   | Link                                                    | Maintainer                                    |
|:--------------:|:-------------------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/  | [mikelpint](https://github.com/mikelpint)     |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/                | [JourneyOver](https://github.com/JourneyOver) |
| Homebrew (Mac) | https://formulae.brew.sh/cask/nuclear                   | Homebrew                                      |
| Snap           | https://snapcraft.io/nuclear                            | [nukeop](https://github.com/nukeop)           |
| Flatpak        | https://flathub.org/apps/details/org.js.nuclear.Nuclear | [advaithm](https://github.com/advaithm)       |

big thanks to [ayyeve](https://github.com/ayyEve) for letting me (advaithm) use her server as a compile machine.
## Community translations
Nuclear has already been translated to several languages, and we're always looking for contributors who would like to add more. Below is a list of currently available languages, along with contributors who helped to translate Nuclear to that language.

| Language             | Contributor                                                                                          |
|:--------------------:|:----------------------------------------------------------------------------------------------------:|
| English              | N/A                                                                                                  |
| French               | [charjac](https://github.com/charjac), [Zalax](https://github.com/Zalaxx)                            |
| Dutch                | [Vistaus](https://github.com/Vistaus)                                                                |
| Danish               | [Hansen1992](https://github.com/Hansen1992)                                                          |
| Spanish              | [mlucas94](https://github.com/mlucas94), [emlautarom1](https://github.com/emlautarom1)               |
| Polish               | [kazimierczak-robert](https://github.com/kazimierczak-robert), [gradzka](https://github.com/gradzka) |
| German               | [schippas](https://github.com/schippas)                                                              |
| Russian              | [ramstore07](https://github.com/ramstore07), [dmtrshat](https://github.com/dmtrshat)                 |
| Brazilian Portuguese | [JoaoPedroMoraes](https://github.com/JoaoPedroMoraes)                                                |
| Turkish              | [3DShark](https://github.com/3DShark)                                                                |
| Italian              | [gello94](https://github.com/gello94)                                                                |
| Slovak               | [MartinT](https://github.com/MartinTuroci)                                                           |
| Czech                | [PetrTodorov](https://github.com/PetrTodorov)                                                        |
| Tagalog              | [giftofgrub](https://github.com/giftofgrub)                                                          |
| Traditional Chinese  | [oxygen-TW](https://github.com/oxygen-TW)                                                            |
| Swedish              | [PalleKarlsson](https://github.com/PalleKarlsson)                                                    |
| Greek                | [Shuin-San](https://github.com/Shuin-San)                                                            |

## Development process

First of all, be sure to check out the [Contribution Wiki Page](https://github.com/nukeop/nuclear/wiki/Contributing).

Use npm:
```shell
$ npm install # installs dependencies
$ npm start
```

A new window should open that will load the web app and run Nuclear.

---
To build for current operating system:
```shell
$ lerna bootstrap
$ npm run build
```

Instead of `build` you can use `build:all` to build for all operating systems. The binaries will be in `packages/app/release`

---
It's also possible to run the development environment using docker containers, but this should be considered experimental.

You will need docker and docker-compose. You need to allow the root user to connect to X11 display, and then you can run docker-compose:

```shell
$ xhost SI:localuser:root
$ sudo docker-compose up dev
```
As of now you can also build a flatpak version. You will need to install gobject-introspection, and flatpak-builder. After this you will need to install the runtimes and depedencies required by flatapk-builder for the compile process. You will need the 19.08 version of these flatpaks.
```shell
$ flatpak install flathub org.freedesktop.Platform
$ flatpak install flathub org.freedesktop.Sdk
$ flatpak install flathub io.atom.electron.BaseApp
```
Next, to build the project (use the `--verbose` flag to get more output):
```shell
$ flatpak-builder build-dir org.js.nuclear.Nuclear.json
```
To run the built app: 
```shell
$ flatpak-builder --run build-dir org.js.nuclear.Nuclear.json run.sh
```
You can turn the app to a local repo. currently the file builds the latest release.

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
