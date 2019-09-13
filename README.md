# ![nuclear](https://i.imgur.com/oT1006i.png)

[![Maintainability](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) ![Travis](https://api.travis-ci.org/nukeop/nuclear.svg?branch=master)

Desktop music player focused on streaming from free sources

[Official website](https://nuclear.js.org)

[Mastodon](https://mstdn.io/@nuclear)

[Twitter](https://twitter.com/nuclear_player)

Support channel (Matrix): `#nuclear:matrix.org`

## What is this?
nuclear is a free music streaming program that pulls content from free sources all over the internet.

If you know [mps-youtube](https://github.com/mps-youtube/mps-youtube), this is a similar music player but with a GUI.
It's also focusing more on audio. Imagine Spotify which you don't have to pay for and with a bigger library.

## Pre-alpha release
The current version is a pre-alpha early access. Some of it is usable, some of it isn't. If there are things that don't work as expected or are counterintuitive, please open an issue so I can prioritize working on them.

## What if I am religiously opposed to Electron?
See [this](docs/electron.md).

## Features

- Searching for and playing music from youtube (including integration with playlists), jamendo, and soundcloud
- Searching for albums (powered by last.fm and musicbrainz), album view, automatic song lookup based on artist and track name (in progress, can be dodgy sometimes)
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

## Community translations
Nuclear has already been translated to several languages, and we're always looking for contributors who would like to add more. Below is a list of currently available languages, along with contributors who helped to translate Nuclear to that language.

| Language             | Contributor                                                                                          |
|:--------------------:|:----------------------------------------------------------------------------------------------------:|
| English              | N/A                                                                                                  |
| French               | [charjac](https://github.com/charjac)                                                                |
| Dutch                | [Vistaus](https://github.com/Vistaus)                                                                |
| Danish               | [Hansen1992](https://github.com/Hansen1992)                                                          |
| Spanish              | [mlucas94](https://github.com/mlucas94), [emlautarom1](https://github.com/emlautarom1)                                                             |
| Polish               | [kazimierczak-robert](https://github.com/kazimierczak-robert), [gradzka](https://github.com/gradzka) |
| German               | [schippas](https://github.com/schippas)                                                              |
| Russian              | [ramstore07](https://github.com/ramstore07), [dmtrshat](https://github.com/dmtrshat)                 |
| Brazilian Portuguese | [JoaoPedroMoraes](https://github.com/JoaoPedroMoraes)                                                |
| Turkish              | [3DShark](https://github.com/3DShark)                                                                |
| Italian              | [gello94](https://github.com/gello94)                                                                |

## Manual and docs
https://nuclearmusic.rtfd.io/

## Community-maintained packages

Here's a list of packages maintained by third parties. We would like to thank the maintainers for their work.

We do not control these and cannot be held responsible for their contents, but if any of these appear suspicious to you, feel free to open an issue so we can reach out to the maintainers.

| Package type | Link                                                   | Maintainer                                    |
|:------------:|:------------------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)   | https://aur.archlinux.org/packages/nuclear-player-bin/ | [mikelpint](https://github.com/mikelpint)     |
| Choco (Win)  | https://chocolatey.org/packages/nuclear/               | [JourneyOver](https://github.com/JourneyOver) |

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

## Development process
You will need docker and docker-compose.
As all Electron applications, Nuclear has two parts: the server and the web app. Both are containerized. You need to allow the root user to connect to X11 display, and then you can run docker-compose:

```shell
$ xhost SI:localuser:root
$ sudo docker-compose up dev
```

A new window should open that will load the web app and run Nuclear.

---
To run production version:

```bash
$ npm run build:dist
$ npm run electron:prod
```
---
To build for current operating system:
```bash
$ npm run build:dist
$ npm run build:electron
$ npm run pack
```

Instead of `pack` you can use `build:all` to build for all operating systems or `build:[system]` to build for a particular system (see package.json).

In case of errors with dbus/mpris, try removing optional dependencies from package.json and node_modules.

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

#### Support on Beerpay

[![Beerpay](https://beerpay.io/nukeop/nuclear/badge.svg?style=beer-square)](https://beerpay.io/nukeop/nuclear)  [![Beerpay](https://beerpay.io/nukeop/nuclear/make-wish.svg?style=flat-square)](https://beerpay.io/nukeop/nuclear?focus=wish)
