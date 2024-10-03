# ![nuclear](https://i.imgur.com/oT1006i.png)

[![Manutenibilidade](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) ![Travis](https://api.travis-ci.org/nukeop/nuclear.svg?branch=master)

[![Obtenha na Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/nuclear)

Music player para desktop focado no streaming a partir de fontes gratuitas.

[Website oficial](https://nuclearplayer.com)

[Mastodon](https://fosstodon.org/@nuclearplayer)

[Twitter](https://twitter.com/nuclear_player)

Canal para suporte (Matrix): `#nuclear:matrix.org`

## O que é?
nuclear é um programa de streaming de músicas que retira seu conteúdo de fontes gratuitas de varias fontes da internet.

Se você conhece o [mps-youtube](https://github.com/mps-youtube/mps-youtube), este é um music player parecido, porém conta com uma GUI.
Ele também está focado mais em áudio. Imagine um Spotify que você não precisa pagar e com uma biblioteca maior.

## Lançamento pre-alfa
A versão atual é pre-alfa e possui acesso antecipado. Algumas partes estão funcionando, outras não. Se há algo que não está funcionando como esperado ou é contra-intuitivo, por favor abra um  novo issue para que eu possa priorizar a correção dele.

## E se eu for religiosamente contra Electron?
Veja [isto](electron-ptbr.md).

## Features

- Procurar e tocar músicas a partir do YouTube (incluindo integração com playlists e [SponsorBlock](https://sponsor.ajay.app/)), Jamendo e SoundCloud.
- Procura por álbuns (alimentado pelo Last.fm e MusicBrainz), visualização do álbum, procura automática de música baseada no artista e nome da faixa (em progresso, pode ser incorreta e/ou imprecisa às vezes).
- Fila de músicas, podem ser exportadas como uma playlist.
- Carregamento de playlists salvas (salvas como arquivos .json).
- Scrobbling para o last.fm (e 'now playing' status).
- Novos lançamentos e reviews - faixas e álbuns.
- Navegação por gênero.
- Modo rádio (fila automática com faixas similares).
- Downloads ilimitados (alimentado pelo YouTube).
- Letras em tempo real.
- Navegação por popularidade.
- Lista de faixas favoritas.
- Escuta a partir de biblioteca local.

## Manual e docs
https://nuclearmusic.rtfd.io/

## Pacotes mantidos pela comunidade

Aqui temos uma lista de pacotes mantidos por terceiros. Nós gostaríamos de agradecer aos mantenedores pelo trabalho.

Nós não os controlamos e não podemos ser responsabilizados pelos seus conteúdos, mas se algum destes soar suspeito para você, sintá-se livre para abrir um novo issue para que nós possamos contatar os mantenedores.

| Tipo do pacote | Link                                                   | Mantenedor                                    |
|:--------------:|:------------------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/ | [mikelpint](https://github.com/mikelpint)     |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/               | [JourneyOver](https://github.com/JourneyOver) |

## Traduções da comunidade
Nuclear já foi traduzido para diversas línguas, e nós estamos sempre procurando contribuidores que desejam adicionar mais. Abaixo temos uma lista de línguas atualmente disponíveis e os contribuidores que ajudaram a tradução do Nuclear para esta língua.

| Língua               | Contribuidor                                                                                         |
|:--------------------:|:----------------------------------------------------------------------------------------------------:|
| Inglês               | N/A                                                                                                  |
| Francês              | [charjac](https://github.com/charjac), [Zalax](https://github.com/Zalaxx)                            |
| Holandês             | [Vistaus](https://github.com/Vistaus)                                                                |
| Dinamarquês          | [Hansen1992](https://github.com/Hansen1992)                                                          |
| Espanhol             | [mlucas94](https://github.com/mlucas94), [emlautarom1](https://github.com/emlautarom1)               |                                              |
| Polonês              | [kazimierczak-robert](https://github.com/kazimierczak-robert), [gradzka](https://github.com/gradzka) |
| Alemão               | [schippas](https://github.com/schippas)                                                              |
| Russo                | [ramstore07](https://github.com/ramstore07), [dmtrshat](https://github.com/dmtrshat)                 |
| Português brasileiro | [JoaoPedroMoraes](https://github.com/JoaoPedroMoraes)                                                |
| Turco                | [3DShark](https://github.com/3DShark)                                                                |
| Italiano             | [gello94](https://github.com/gello94)                                                                |
| Eslovaco             | [MartinT](https://github.com/MartinTuroci)                                                           |
| Tcheco               | [PetrTodorov](https://github.com/PetrTodorov)                                                        |
| Filipino             | [giftofgrub](https://github.com/giftofgrub)                                                          |

## Screenshots

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

## Processo de Desenvolvimento
Você precisará do docker e do docker-compose.
Assim como todas aplicações em Electron, Nuclear possui duas partes: o servidor e a aplicação web. Ambos são conteinerizados. Você deve permitir que o usuário administrador se conecte ao X11 display, e então pode rodar o docker-compose:

```shell
$ xhost SI:localuser:root
$ sudo docker-compose up dev
```

Uma nova janela abrirá, a qual carregará a aplicação web e executará o Nuclear.
Em sistemas non-linux você pode usar o Lerna:
```shell
$ npm i -g lerna #installs lerna globally
$ lerna bootstrap
$ lerna run start
```

---
Build para o sistema operacional atual:
```bash
$ npm run build
```

Ao invés de `build`, você pode usar o `build: all` para fazer a build para todos sistemas operacionais. TOs binários estarão presentes em `packages/app/release`

No caso de erros com dbus/mpris, tente remover as dependências opcionais do `packages/app/package.json` e node_modules.

## Licença

Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo sob os termos do GNU Affero General Public License publicados pelo Free Software Foundation, seja a versão 3, ou (à sua escolha) qualquer versão à frente dela.
