# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![Maintainability](https://api.codeclimate.com/v1/badges/a15c4888a63c900f6cc1/maintainability)](https://codeclimate.com/github/nukeop/nuclear/maintainability) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/30750586202742279fa8958a12e519ed)](https://www.codacy.com/app/nukeop/nuclear?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nukeop/nuclear&amp;utm_campaign=Badge_Grade) [![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) ![Travis](https://api.travis-ci.org/nukeop/nuclear.svg?branch=master)

Skrivbordsapp som fokuserar på att streama musik från avgiftsfria källor

![Showcase](https://i.imgur.com/G9BqIHl.png)

# Länkar

[Officiell hemsida](https://nuclear.js.org)

[Mastodon](https://mstdn.io/@nuclear)

[Twitter](https://twitter.com/nuclear_player)

Supportkanal (Matrix): `#nuclear:matrix.org`

Discordkanal: https://discord.gg/JqPjKxE

Readmeöversättningar:

<kbd>[<img title="Português" alt="Português" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/br.svg" width="22">](README-ptbr.md)</kbd>
<kbd>[<img title="Svenska" alt="Svenska" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/se.svg" width="22">](README-se.md)</kbd>
<kbd>[<img title="English" alt="English" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/us.svg" width="22">](../README.md)</kbd>
<kbd>[<img title="Hebrew" alt="Hebrew" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/il.svg" width="22">](README-he.md)</kbd>
<kbd>[<img title="Italiano" alt="Italiano" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/it.svg" width="22">](README-it.md)</kbd>

## Vad är detta?
nuclear är ett gratis musikstreamingprogram som hämtar innehåll från avgifstfria källor överallt på internet.

Om du är bekant med [mps-youtube](https://github.com/mps-youtube/mps-youtube), så är detta ett liknande program fast med ett GUI.
Som dessutom fokuserar mer på musk. Föreställ dig  ett Spotify som du inte behöver betala för och med ett större utbud.

## Men om jag är en principiell motståndare till Electron?
Kolla in [det här](docs/electron.md).

## Funktioner

- Sökande och uppspelning av musik från YouTube (inklusive spellisteintegration och [SponsorBlock](https://sponsor.ajay.app/)), jamendo och SoundCloud
- Albumsökning (med hjälp av Last.fm och MusicBrainz), albumvy, automatiskt uppletande av låtar baserat på artist och spårets namn (pågående arbete, inte riktigt där än)
- Låtkö som kan exporteras till spellistor
- Inläsning av sparade spellistor (sparas som JSON filer)
- Skrobblande till last.fm (inklusive uppdaterande av "nu spelas"-status  )
- Senaste släppen med recensioner - spår och album
- Bläddrande baserat på genre
- Radioläge (köar automatiskt liknande låtar)
- Obegränsade nedladdningar (genom youtube)
- Låttexter i realtid
- Bläddra baserat på popularitet
- Lista över dina favoritlåtar
- Lyssnande från lokalt musikbibliotek

## Manual och dokumentation
https://nuclearmusic.rtfd.io/

## Community-underhållna paket

Här är en lista över programvarupaket i diverse pakethanterare, varav de flesta underhålls av tredje parter. Vi skulle vilja tacka alla dem för deras arbete.

| Pakettyp   | Länk                                                   | Underhållare                                    |
|:--------------:|:------------------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/ | [mikelpint](https://github.com/mikelpint)     |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/               | [JourneyOver](https://github.com/JourneyOver) |
| Homebrew (Mac) | https://formulae.brew.sh/cask/nuclear                  | Homebrew                                      |
| Snap           | https://snapcraft.io/nuclear                           | [nukeop](https://github.com/nukeop)           | 

## Communityöversättningar 
Nuclear har redan översatts till ett flertal språk, och vi är alltid på jakt efter folk som vill bidra med ännu fler. Nedan följer en lista över de språk som redan finns översatta tillsammans med personerna som har kommit med bidragen.

| Språk             | Den som bidrog                                                                                          |
|:--------------------:|:----------------------------------------------------------------------------------------------------:|
| English              | N/A                                                                                                  |
| French               | [charjac](https://github.com/charjac), [Zalax](https://github.com/Zalaxx)                            |
| Dutch                | [Vistaus](https://github.com/Vistaus)                                                                |
| Danish               | [Hansen1992](https://github.com/Hansen1992)                                                          |
| Spanish              | [mlucas94](https://github.com/mlucas94), [emlautarom1](https://github.com/emlautarom1)                                                             |
| Polish               | [kazimierczak-robert](https://github.com/kazimierczak-robert), [gradzka](https://github.com/gradzka) |
| German               | [schippas](https://github.com/schippas)                                                              |
| Russian              | [ramstore07](https://github.com/ramstore07), [dmtrshat](https://github.com/dmtrshat)                 |
| Brazilian Portuguese | [JoaoPedroMoraes](https://github.com/JoaoPedroMoraes)                                                |
| Turkish              | [3DShark](https://github.com/3DShark)                                                                |
| Italian              | [gello94](https://github.com/gello94)                                                                |
| Slovak               | [MartinT](https://github.com/MartinTuroci)                                                           |
| Czech                | [PetrTodorov](https://github.com/PetrTodorov)                                                        |
| Tagalog                | [giftofgrub](https://github.com/giftofgrub)                                                        |
| Traditional Chinese         | [oxygen-TW](https://github.com/oxygen-TW)                                                     |
| Swedish                             | [PalleKarlsson](https://github.com/PalleKarlsson)                                             |

## Utvecklingsprocess
Använd lerna:
```shell
$ npm i -g lerna #installs lerna globally
$ lerna bootstrap
$ npm start
```

Ett nytt fönster borde öppnas som kommer att ladda webbappen och köra Nuclear.

---
För att bygga för det nuvarande operativsystemet:
```bash
$ lerna bootstrap
$ npm run build
```

Istället för `build` kan du använda ``build:all` om du vill bygga för alla operativsystem. Binärfilerna komme attr läggas i `packages/app/release`

---
Det är också möjligt att få upp utvecklingsmiljön med hjälp av docker-containers.

Du behöver ha docker och docker-compose installerade, samt ha gett root-användaren rättigheter att ansluta till X11-displayen. Sen kan du köra docker-compose:

```shell
$ xhost SI:localuser:root
$ sudo docker-compose up dev
```

## Skärmdumpar
Den här sektionen kommer uppdateras allt eftersom programmet utvecklas.

![Albumsök](https://i.imgur.com/idFVnAF.png)

![Albumvy](https://i.imgur.com/Kvzo3q7.png)

![Artistvy](https://i.imgur.com/imBLYl3.png)

![Överblick Bästa Nya Musiken](https://i.imgur.com/bMDrR4M.png)

![Överblick Genrer](https://i.imgur.com/g0aCmKx.png)

![Spellistevy](https://i.imgur.com/2VMXHDC.png)

![Låttextvy](https://i.imgur.com/7e3DJKJ.png)

![Equalizervy](https://i.imgur.com/WreRL0w.png)

## Licens

Det här programmet är gratis mjukvara: du kan återdistribuera det och/eller modifiera det under GNU Affero General Public License vilkor, så som de publicerades av Free Software Foundation. Antingen version 3 av licensen, eller (om du föredrar) en senare version.