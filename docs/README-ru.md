# ![nuclear](https://i.imgur.com/oT1006i.png)
[![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/JqPjKxE)

Десктопный музыкальный проигрыватель, ориентированный на потоковую передачу из бесплатных источников

![Showcase](https://i.imgur.com/8qHu66J.png)

# Ссылки

[Официальный сайт](https://nuclearplayer.com)

[Скачать](https://github.com/nukeop/nuclear/releases)

[Документация](https://nukeop.gitbook.io/nuclear/)

[Mastodon](https://fosstodon.org/@nuclearplayer)

[Twitter](https://twitter.com/nuclear_player)

Канал поддержки (Matrix): `#nuclear:matrix.org`

Discord чат: https://discord.gg/JqPjKxE

Предлагайте и голосуйте за новые функции здесь: https://nuclear.featureupvote.com/

Переводы документации:

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
<kbd>[<img title="Polski" alt="Polski" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/pl.svg" width="22">](docs/README-pl.md)</kbd>

## Что это?
Nuclear - это бесплатная программа для потоковой передачи музыки, которая извлекает контент из бесплатных источников по всему Интернету.

Если вы знакомы с [mps-youtube](https://github.com/mps-youtube/mps-youtube), то это похожий музыкальный проигрыватель, но с графическим интерфейсом.
Он также больше специализируется на аудио. Представьте себе Spotify с большой библиотекой за который не нужно платить.

## Что если мне не нравится Electron?
Посмотрите [здесь](docs/electron-ru.md).

## Особенности

- Поиск и воспроизведение музыки с YouTube (включая интеграцию с плейлистами, а также [Sponsor Block](https://sponsor.ajay.app/), Jamendo, Audius и SoundCloud)
- Функция поиска альбомов (на основе Last.fm и Discogs), просмотра альбомов, автоматического поиска песен по исполнителю и названию трека (в разработке, иногда может не работать)
- Очередность песен, можно экспортировать в виде плейлиста
- Загружать сохраненные плейлисты (хранятся в файлах формата json)
- Синхронизация с last.fm (также обновляет статус «Исполняется»)
- Новейшие релизы с обзорами - треки и альбомы
- Поиск по жанрам
- Режим радио (автоматически подбирает похожие треки)
- Неограниченное количество загрузок (на основе YouTube)
- Отображение текстов песен в реальном времени
- Поиск по популярности
- Список любимых треков
- Прослушивание песен из локальной библиотеки
- Нет необходимости в аккаунте
- Без рекламы
- Без CoC (Кодекса поведения)
- Без CLA (Лицензионного соглашения с пользователем)

## Процесс разработки

Во-первых, убедитесь что вы прочли [Contribution Guidelines](https://nukeop.gitbook.io/nuclear/contributing/contribution-guidelines).

Инструкцию по запуску Nuclear в режиме разработки можно найти в документации [Development Process](https://nukeop.gitbook.io/nuclear/developer-resources/development-process).

## Пакеты, поддерживаемые сообществом

Ниже приведен список пакетов, используемых в различных менеджерах пакетов, некоторые из которых поддерживаются сторонними мейнтейнерами и имеют открытый исходный код.
Мы бы хотели искренне поблагодарить их за вклад в развитие.

|   Тип пакета   |                               Ссылка                               |                        Мейнтейнер                         |                Метод установки                 |
|:--------------:|:------------------------------------------------------------------:|:---------------------------------------------------------:|:----------------------------------------------:|
|   AUR (Arch)   |       https://aur.archlinux.org/packages/nuclear-player-bin/       |            [nukeop](https://github.com/nukeop)            |           yay -s nuclear-player-bin            |
|   AUR (Arch)   |       https://aur.archlinux.org/packages/nuclear-player-git        |            [nukeop](https://github.com/nukeop)            |           yay -s nuclear-player-git            |
|  Choco (Win)   |              https://chocolatey.org/packages/nuclear/              |       [JourneyOver](https://github.com/JourneyOver)       |             choco install nuclear              |
| GURU (Gentoo)  | https://github.com/gentoo/guru/tree/master/media-sound/nuclear-bin |                         Orphaned                          |               emerge nuclear-bin               |
| Homebrew (Mac) |               https://formulae.brew.sh/cask/nuclear                |                         Homebrew                          |          brew install --cask nuclear           |
|      Snap      |                    https://snapcraft.io/nuclear                    |            [nukeop](https://github.com/nukeop)            |           sudo snap install nuclear            |
|    Flatpak     |      https://flathub.org/apps/details/org.js.nuclear.Nuclear       |            [nukeop](https://github.com/nukeop)            | flatpak install flathub org.js.nuclear.Nuclear |
|   Void Linux   |       https://github.com/machadofguilherme/nuclear-template        | [machadofguilherme](https://github.com/machadofguilherme) |                   See readme                   


## Переводы от сообщества
Документация Nuclear и само приложение уже было переведено на некоторые языки, однако, мы всегда ищем людей готовых внести свой вклад и помочь нам с переводом.

Мы используем [Crowdin](https://crowdin.com/project/nuclear) для управления локализацией. Используя его, вы сможете проверить, поддерживается ли ваш язык, отслеживать прогресс локализации и сможете помогать нам переводить Nuclear на другие языки.

## Скриншоты

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

## Лицензия

Эта программа является свободным программным обеспечением: вы можете распространять ее и / или изменять в соответствии с условиями GNU Affero General Public License, опубликованной Фондом свободного программного обеспечения, либо версией 3 Лицензии, либо (по вашему выбору) любой более поздней версии.

## Атрибуты
Использование данных SponsorBlock лицензировано в соответствии с [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) на https://sponsor.ajay.app/.