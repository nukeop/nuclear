# nuclear [![Maintainability](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/test_coverage)](https://codeclimate.com/github/nukeop/nuclear/test_coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) ![Travis](https://api.travis-ci.org/nukeop/nuclear.svg?branch=master)

An Electron-based, multiplatform music player app that streams from multiple sources

## What is this?
nuclear is a free music streaming program that pulls content from free sources all over the internet.

If you know [mps-youtube](https://github.com/mps-youtube/mps-youtube), this is a similar music player but with a GUI.
It's also focusing more on audio. Imagine Spotify which you don't have to pay for and with a bigger library.

## Rewritten from scratch

This version of Nuclear has been rewritten from scratch and is being currently prepared for the 0.4.0 release. The code is completely new, much more maintainable and extensible.

## Features

- Searching for and playing music from youtube (including integration with playlists), bandcamp (including albums), and soundcloud
- Searching for related songs in youtube
- Downloading from youtube
- Searching for albums (powered by last.fm and musicbrainz), album view, automatic song lookup based on artist and track name (in progress, can be dodgy sometimes)
- Song queue, which can be exported as a playlist
- Loading saved playlists (stored in json files)
- Scrobbling to last.fm (along with updating the 'now playing' status)

## Planned features

- Support for local files
- Browsing by genre
- Browsing by popularity
- Country-specific top lists
- Newest releases
- Listening suggestions (similar artists, albums, tracks)
- Unlimited downloads
- Realtime lyrics
- Locally stored library/favourites

## Community-maintained packages

Here's a list of packages maintained by third parties. We would like to thank the maintainers for their work.

We do not control these and cannot be held responsible for their contents, but if any of these appear suspicious to you, feel free to open an issue so we can reach out to the maintainers.

| Package type   |                        Link                        | Maintainer                    |
|:--------------:|:--------------------------------------------------:|:-----------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player/ | [mikelpint](https://github.com/mikelpint)  |

## Screenshots
This will be updated as the program evolves.

![album search](http://i.imgur.com/tLSv6pw.png)

![album display](http://i.imgur.com/hAEXUaQ.png)

![artist view](http://i.imgur.com/DCrlVqt.png)

![dashboard](https://i.imgur.com/tewcTEu.png)

![playlist view](http://i.imgur.com/YM3eP3i.png)

## Dev build process
To develop the project locally, you should only do:
```
npm install
npm run watch
```
This launches webpack. It watches local files for changes and rebuilds the project as needed. The project also has hot reload built in.
And in another terminal window:
```
npm run electron
```

This launches a development version of the program. Tmux is very useful here so you can keep an eye on all running processes.

If you're getting a message about dbus being compiled with a different version of node when running the electron script, try the following:
```
npm install electron-rebuild
.node_modules/.bin/electron-rebuild
```

And run the script again.


#### Support on Beerpay

[![Beerpay](https://beerpay.io/nukeop/nuclear/badge.svg?style=beer-square)](https://beerpay.io/nukeop/nuclear)  [![Beerpay](https://beerpay.io/nukeop/nuclear/make-wish.svg?style=flat-square)](https://beerpay.io/nukeop/nuclear?focus=wish)
