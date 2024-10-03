# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/JqPjKxE)

Lecteur de musique spécialisé dans le streaming depuis des sources gratuites

![Showcase](https://i.imgur.com/8qHu66J.png)

# Links

[Site officiel](https://nuclearplayer.com)

[Téléchargements](https://github.com/nukeop/nuclear/releases)

[Documentation](https://nukeop.gitbook.io/nuclear/)

[Mastodon](https://fosstodon.org/@nuclearplayer)

[Twitter](https://twitter.com/nuclear_player)

Support (Matrix): `#nuclear:matrix.org`

Discord : https://discord.gg/JqPjKxE

Suggérer et voter pour les nouvelles fonctionnalités ici : https://nuclear.featureupvote.com/

Traductions de la documentation :

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

## Qu'est-ce ?
nuclear est un logiciel de streaming de musique gratuit qui récupère son contenu depuis des sources gratuites partout sur internet.

Si vous connaissez [mps-youtube](https://github.com/mps-youtube/mps-youtube), c'est un lecteur de musique comparable, mais avec une interface utilisateur graphique.
Nuclear se concentre aussi davantage sur l'audio. Imaginez Spotify, mais sans payer et avec
une librairie encore plus vaste.

## Et si je suis religieusement contre Electron ?
Voir [ceci](docs/electron-fr.md).

## Fonctionnalités

- Rechercher et jouer de la musique depuis YouTube (support intégré des playlists et de [SponsorBlock](https://sponsor.ajay.app/)), Jamendo, Audius et Soundcloud
- Rechercher des albums (grâce à Last.fm et Discogs), pochettes d'album, recherche de morceaux par artiste et nom de chanson (travail en cours de réalisation, résultats parfois douteux)
- File de morceaux, qui peut être exportée en playlist
- Charger des playlists sauvegardées (enregistrées sous forme de fichiers json)
- Partager sur last.fm (tout en mettant à jour le status 'en cours de lecture')
- Newest releases with reviews - tracks and albums
- Rechercher par genre
- Mode radio (ajoute automatiquement des morceaux similaires à la file)
- Téléchargements illimités (grâce à YouTube)
- Paroles en temps réel
- Rechercher par popularité
- Liste des morceaux favoris
- Écouter des morceaux de la bibliothèque locale
- Pas de compte
- Pas de pub
- Pas de code de conduite
- Pas CLA

## Contribuer au développement

Tout d'abord, assurez-vous de lire le [Guide du Contributeur](https://nukeop.gitbook.io/nuclear/contributing/contribution-guidelines).

Les instructions pour faire tourner Nuclear en mode développement se trouvent dans le document [Processus de développement](https://nukeop.gitbook.io/nuclear/developer-resources/development-process).

## Packages maintenus par la communauté

Voici une liste de packages pour différent gestionaires. Certains sont maintenus par des tiers. Nous aimerions remercier les mainteneurs pour leur travail.

| Type de package | Lien                                                               | Mainteneur                                   | Méthode d'installation                        |
|:---------------:|:------------------------------------------------------------------:|:--------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)      | https://aur.archlinux.org/packages/nuclear-player-bin/             | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-bin                     |
| AUR (Arch)      | https://aur.archlinux.org/packages/nuclear-player-git              | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-git                     |
| Choco (Win)     | https://chocolatey.org/packages/nuclear/                           | [JourneyOver](https://github.com/JourneyOver)| choco install nuclear                         |
| GURU (Gentoo)   | https://github.com/gentoo/guru/tree/master/media-sound/nuclear-bin | Orphaned                                     | emerge nuclear-bin                            |
| Homebrew (Mac)  | https://formulae.brew.sh/cask/nuclear                              | Homebrew                                     | brew install --cask nuclear                   |
| Snap            | https://snapcraft.io/nuclear                                       | [nukeop](https://github.com/nukeop)          | sudo snap install nuclear                     |
| Flatpak         | https://flathub.org/apps/details/org.js.nuclear.Nuclear            | [nukeop](https://github.com/nukeop)          | flatpak install flathub org.js.nuclear.Nuclear|
| Void Linux      | https://github.com/machadofguilherme/nuclear-template              | [machadofguilherme](https://github.com/machadofguilherme) | Voir le README


## Traductions par la communauté
Nuclear ad déjà été traduit dans plusieurs langues, et nous cherchons toujours des contributeurs pour en ajouter.

Nous utilisons [Crowdin](https://crowdin.com/project/nuclear) pour gérer les traductions. Vous pouvez vérifier si votre langage est supporté, voir où en est la traduction, et nous aider à traduire Nuclear ici.

## Captures d'écran

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

## Licence

Ce programme est un logiciel libre: vous pouvez le redistribuer et/ou le modifier selon les termes de la GNU Affero General Public License telle que publiée par la Free Software Foundation, sout sous la version 3 de la licence, soit (si vous le désirez), sous toute autre version ultérieure.

## Attributions

Utilise les données de SponsorBlock, qui sont sous licence [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) depuis https://sponsor.ajay.app/.
