# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![Maintainability](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) [![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) ![Travis](https://api.travis-ci.org/nukeop/nuclear.svg?branch=master)

무료 음악 스트리밍을 위한 데스크탑 음악 재생 프로그램

![Showcase](https://i.imgur.com/G9BqIHl.png)

# Links

[공식 사이트](https://nuclearplayer.com)

[Mastodon](https://fosstodon.org/@nuclearplayer)

[트위터](https://twitter.com/nuclear_player)

지원 채널 (Matrix): `#nuclear:matrix.org`

디스코드 채널: https://discord.gg/JqPjKxE

Readme 번역 목록: 

<kbd>[<img title="Deutsch" alt="Deutsch" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/de.svg" width="22">](docs/README-de.md)</kbd>
<kbd>[<img title="Português" alt="Português" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/br.svg" width="22">](docs/README-ptbr.md)</kbd>
<kbd>[<img title="Svenska" alt="Svenska" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/se.svg" width="22">](docs/README-se.md)</kbd>
<kbd>[<img title="English" alt="English" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/us.svg" width="22">](README.md)</kbd>
<kbd>[<img title="Hebrew" alt="Hebrew" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/il.svg" width="22">](docs/README-he.md)</kbd>
<kbd>[<img title="Italiano" alt="Italiano" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/it.svg" width="22">](docs/README-it.md)</kbd>
<kbd>[<img title="Korean" alt="Korean" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/kr.svg" width="22">](docs/README-ko.md)</kbd>
<kbd>[<img title="Indonesia" alt="Indonesia" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/id.svg" width="22">](docs/README-id.md)</kbd>
<kbd>[<img title="Français" alt="Français" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/fr.svg" width="22">](docs/README-fr.md)</kbd>


## nuclear는 어떤 프로그램인가요?
nuclear는 인터넷상의 무료 음악을 재생하는 무료 음악 스트리밍 프로그램입니다.

[mps-youtube](https://github.com/mps-youtube/mps-youtube)와 비슷하지만, GUI를 가지고 있습니다.
또, 오디오에 좀 더 초점을 맞추고 있습니다. 돈 낼 필요도 없고, 더 다양한 음악을 들을 수 있는 Spotify라고 할 수 있죠.

## 만약 제가 Electron을 끔찍이도 싫어한다면요?
[이 글](docs/electron.md)을 참조하세요. (번역되지 않음)

## 기능

- 유투브에서 음악 검색 및 재생 (플레이리스트, [SponsorBlock](https://sponsor.ajay.app/)), Jamendo, Audius 및 SoundCloud 연동)
- 앨범 검색 (Last.fm 및 Discogs에서 가져옴), 앨범 보기, 아티스트와 음악 제목 기반 자동 음악 검색 (개발 중, 때로 안 될 수 있음)
- 플레이리스트로 추가할 수 있는 재생 목록
- 저장한 플레이리스트 가져오기 (json 형식으로 저장)
- Last.fm에서 Scrobbing하기 ('지금 재생 중' 상태 업데이트 포함) 
- 새로운 음악과 앨범 및 그에 대한 리뷰 제공
- 음악 장르별 탐색
- 자동 재생 모드 (비슷한 음악 자동 재생)
- 무제한 다운로드 (유투브에서 가져옴) 
- 실시간 가사
- 인기 음악 검색
- 좋아하는 음악 목록
- PC에 저장되어있는 내 음악 재생 
- 가입 필요없음
- 광고 없음
- 행동강령(CoC) 없음
- 기여자 라이선스 동의(CLA) 없음

## 매뉴얼 및 문서
https://nuclearmusic.rtfd.io/

## Community-maintained packages

다음은 다양한 manager를 위한 패키지 목록입니다. 대부분 제3자에 의해 관리되고 있습니다. 관리자들께 감사를 전합니다.

| Package type   | Link                                                    | Maintainer                                    |
|:--------------:|:-------------------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/  | [advaithm](https://github.com/advaithm)       |
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-git   | [advaithm](https://github.com/advaithm)       |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/                | [JourneyOver](https://github.com/JourneyOver) |
| Homebrew (Mac) | https://formulae.brew.sh/cask/nuclear                   | Homebrew                                      |
| Snap           | https://snapcraft.io/nuclear                            | [nukeop](https://github.com/nukeop)           |
| Flatpak        | https://flathub.org/apps/details/org.js.nuclear.Nuclear  | [advaithm](https://github.com/advaithm)       |

자신의 서버를 compile machine으로 사용하게 해준 [ayyeve](https://github.com/ayyEve)에게 감사를 전합니다.

## 커뮤니티 번역
Nuclear는 이미 여러 언어로 번역되었고, 현재도 새로운 언어를 추가하고 싶은 기여자들을 찾고 있습니다. 다음은 Nuclear를 해당 언어로 번역해주신 기여자와 현재 사용 가능한 언어 목록입니다.

| 언어             | 기여자                                                                                          |
|:--------------------:|:----------------------------------------------------------------------------------------------------:|
| 영어              | 해당 없음                                                                            |
| 프랑스어               | [charjac](https://github.com/charjac), [Zalax](https://github.com/Zalaxx)                            |
| 네덜란드어                | [Vistaus](https://github.com/Vistaus)                                                                |
| 덴마크어               | [Hansen1992](https://github.com/Hansen1992)                                                          |
| 스페인어              | [mlucas94](https://github.com/mlucas94), [emlautarom1](https://github.com/emlautarom1)               |
| 폴란드어               | [kazimierczak-robert](https://github.com/kazimierczak-robert), [gradzka](https://github.com/gradzka) |
| 독일어               | [nuclear](https://github.com/nuclear), [schippas](https://github.com/schippas)                                                              |
| 러시아어              | [ramstore07](https://github.com/ramstore07), [dmtrshat](https://github.com/dmtrshat)                 |
| 브라질 포르투갈어 Portuguese | [JoaoPedroMoraes](https://github.com/JoaoPedroMoraes)                                                |
| 터키어             | [3DShark](https://github.com/3DShark)                                                                |
| 이탈리아어              | [gello94](https://github.com/gello94)                                                                |
| 슬로바키아어               | [MartinT](https://github.com/MartinTuroci)                                                           |
| 체코어                | [PetrTodorov](https://github.com/PetrTodorov)                                                        |
| 타갈로그어              | [giftofgrub](https://github.com/giftofgrub)                                                          |
| 중국어 (번체)  | [oxygen-TW](https://github.com/oxygen-TW)                                                            |
| 스웨덴어              | [PalleKarlsson](https://github.com/PalleKarlsson), [nonew-star](https://github.com/nonew-star)                                                    |
| 그리스어                | [Shuin-San](https://github.com/Shuin-San)                                                            |
| 베트남어           | [HaiDang666](https://github.com/HaiDang666)                                                          |
| 핀란드어              | [cjola002-xamk](https://github.com/cjola002-xamk)                                                    |
| 한국어              | [dexterastin](https://github.com/dexterastin), [teamzamong](https://github.com/teamzamong/)                                                    |

## 개발 환경 설정

시작하기 전, [Contribution Wiki Page](https://github.com/nukeop/nuclear/wiki/Contributing)를 읽어주세요.

npm 설정:
```shell
$ npm install # installs dependencies
$ npm start
```

Web app을 로드하고 Nuclear를 실행할 새로운 창이 뜰 것입니다.

---
현재 사용하고 있는 운영체제에 맞게 빌드합니다.
```shell
$ lerna bootstrap
$ npm run build
```

`build` 대신 `build:all`을 사용해 모든 운영체제에 대해 빌드할 수 있습니다. 바이너리 파일은 `packages/app/release`에서 확인할 수 있습니다.

---
Docker 컨테이너를 사용해 개발 환경을 실행할 수도 있지만, 아직 실험적인 기능입니다.

이를 위해서 Docker와 docker-compose가 필요합니다. root 사용자가 X11 display에 연결할 수 있도록 허가한 후, docker-compose를 실행할 수 있습니다.

```shell
$ xhost SI:localuser:root
$ sudo docker-compose up dev
```
flatpak 버전도 빌드할 수 있습니다. 이를 위해서 gobject-introspection와 flatpak-builder를 설치해야 합니다. 그 후, flatpak-builder 컴파일을 위해 필요한 runtimes과 dependencies를 설치해야 합니다. flatpak 버전 19.08이 필요합니다.  
```shell
$ flatpak install flathub org.freedesktop.Platform
$ flatpak install flathub org.freedesktop.Sdk
$ flatpak install flathub io.atom.electron.BaseApp
```
프로젝트를 빌드합니다. (`--verbose` flag를 사용해 더 많은 정보를 얻을 수 있습니다)
```shell
$ flatpak-builder build-dir org.js.nuclear.Nuclear.json
```
빌드한 애플리케이션을 실행합니다.
```shell
$ flatpak-builder --run build-dir org.js.nuclear.Nuclear.json run.sh
```
애플리케이션을 로컬 repository로 만들 수 있습니다. 현재 파일은 최신 릴리즈를 빌드합니다. 

## 실제 화면 

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

## 라이선스

이 프로그램은 무료 소프트웨어입니다. Free Software Foundation의 GNU Affero General Public License (버전 3, 또는 더 최신 버전)에 따라 재배포 또는 수정할 수 있습니다. 
