# ![nuclear](https://i.imgur.com/oT1006i.png)

[![Maintainability](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/test_coverage)](https://codeclimate.com/github/nukeop/nuclear/test_coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) ![Travis](https://api.travis-ci.org/nukeop/nuclear.svg?branch=master)

Desktop music player focused on streaming from free sources

[Official website](http://nuclear.gumblert.tech)

[Mastodon](https://mstdn.io/@nuclear)

[Twitter](https://twitter.com/nuclear_player)

## What is this?
nuclear is a free music streaming program that pulls content from free sources all over the internet.

If you know [mps-youtube](https://github.com/mps-youtube/mps-youtube), this is a similar music player but with a GUI.
It's also focusing more on audio. Imagine Spotify which you don't have to pay for and with a bigger library.

## Pre-alpha release
The current version is a pre-alpha early access. Some of it is usable, some of it isn't. If there are things that don't work as expected or are counterintuitive, please open an issue so I can prioritize working on them.

## Rewritten from scratch

This version of Nuclear has been rewritten from scratch and released in version 0.4.0. The code is completely new, much more maintainable and extensible.

## Features

- Searching for and playing music from youtube (including integration with playlists), bandcamp (including albums), and soundcloud
- Searching for related songs in youtube
- Downloading from youtube
- Searching for albums (powered by last.fm and musicbrainz), album view, automatic song lookup based on artist and track name (in progress, can be dodgy sometimes)
- Song queue, which can be exported as a playlist
- Loading saved playlists (stored in json files)
- Scrobbling to last.fm (along with updating the 'now playing' status)
- Newest releases with reviews - tracks and albums
- Browsing by genre

## Planned features

- Support for local files
- Browsing by popularity
- Country-specific top lists
- Listening suggestions (similar artists, albums, tracks)
- Unlimited downloads
- Realtime lyrics
- Locally stored library/favourites

## Manual and docs
http://nuclearmusic.rtfd.io/

## Community-maintained packages

Here's a list of packages maintained by third parties. We would like to thank the maintainers for their work.

We do not control these and cannot be held responsible for their contents, but if any of these appear suspicious to you, feel free to open an issue so we can reach out to the maintainers.

| Package type   |                        Link                        | Maintainer                    |
|:--------------:|:--------------------------------------------------:|:-----------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player/ | [mikelpint](https://github.com/mikelpint)  |

## Screenshots
This will be updated as the program evolves.

![laptop mockup 1](https://i.imgur.com/31Tc5qf.jpg)

![laptop mockup 2](https://i.imgur.com/HqMP5HF.jpg)

![album search](http://i.imgur.com/tLSv6pw.png)

![album display](http://i.imgur.com/hAEXUaQ.png)

![artist view](http://i.imgur.com/DCrlVqt.png)

![dashboard](https://i.imgur.com/tewcTEu.png)

![playlist view](http://i.imgur.com/YM3eP3i.png)

![genre view](https://i.imgur.com/KrzUvwp.png)

## Dev build process
To develop the project locally, you should only do:
```bash
$ npm install
$ npm run watch
```
This launches webpack. It watches local files for changes and rebuilds the project as needed. The project also has hot reload built in.
And in another terminal window:
```bash
$ npm run electron:dev
```
This launches a development version of the program. Tmux is very useful here so you can keep an eye on all running processes.

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

#### Support on Beerpay

[![Beerpay](https://beerpay.io/nukeop/nuclear/badge.svg?style=beer-square)](https://beerpay.io/nukeop/nuclear)  [![Beerpay](https://beerpay.io/nukeop/nuclear/make-wish.svg?style=flat-square)](https://beerpay.io/nukeop/nuclear?focus=wish)
