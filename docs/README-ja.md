# ![nuclear](https://i.imgur.com/oT1006i.png) 
[![nuclear](https://snapcraft.io//nuclear/badge.svg)](https://snapcraft.io/nuclear) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/JqPjKxE)

無料の提供元からのストリーミングに特化したデスクトップ用音楽プレイヤー

![Showcase](https://i.imgur.com/8qHu66J.png)

# リンク

[公式サイト](https://nuclearplayer.com)

[ダウンロード](https://github.com/nukeop/nuclear/releases)

[解説文書](https://nukeop.gitbook.io/nuclear/)

[Mastodon](https://fosstodon.org/@nuclearplayer)

[Twitter](https://twitter.com/nuclear_player)

サポート用チャンネル (Matrix): `#nuclear:matrix.org`

Discord チャット: https://discord.gg/JqPjKxE

新機能の提案と投票はこちらへ: https://nuclear.featureupvote.com/

説明の翻訳:

<kbd>[<img title="Deutsch" alt="Deutsch (ドイツ語)" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/de.svg" width="22">](README-de.md)</kbd>
<kbd>[<img title="Português" alt="Português (ポルトガル語)" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/br.svg" width="22">](README-ptbr.md)</kbd>
<kbd>[<img title="Svenska" alt="Svenska" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/se.svg" width="22">](README-se.md)</kbd>
<kbd>[<img title="English" alt="English (英語)" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/us.svg" width="22">](../README.md)</kbd>
<kbd>[<img title="Hebrew" alt="Hebrew (ヘブライ語)" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/il.svg" width="22">](README-he.md)</kbd>
<kbd>[<img title="Italiano" alt="Italiano" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/it.svg" width="22">](README-it.md)</kbd>
<kbd>[<img title="Türkçe" alt="Türkçe" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/tr.svg" width="22">](README-tr.md)</kbd>
<kbd>[<img title="Español" alt="Español" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/es.svg" width="22">](README-es.md)</kbd>
<kbd>[<img title="Indonesia" alt="Indonesia" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/id.svg" width="22">](README-id.md)</kbd>
<kbd>[<img title="Français" alt="Français (フランス語)" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/fr.svg" width="22">](README-fr.md)</kbd>
<kbd>[<img title="Chinese" alt="Chinese (中国語)" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/cn.svg" width="22">](README-zh-cn.md)</kbd>
<kbd>[<img title="Russian" alt="Russian" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/ru.svg" width="22">](README-ru.md)</kbd>
<kbd>[<img title="Polski" alt="Polski" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/pl.svg" width="22">](README-pl.md)</kbd>
<kbd>[<img title="Hindi" alt="Hindi" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/in.svg" width="22">](README-hi.md)</kbd>

## 何これ？　
nuclear は、インターネット上の無料の提供元からコンテンツを取得する、無料の音楽ストリーミングプログラムです。

[yewtube](https://github.com/mps-youtube/yewtube) (mps-youtube) をご存じであれば、似たような音楽プレイヤーですが、nuclear はGUIを備えています。また音声に特化しています。巨大なライブラリになった、無料の Spotify を想像してみてください。

## Electron の使用に反対している場合
[こちらを](electron-ja.md)ご覧ください。

## 機能

- YouTube（再生リストと [SponsorBlock](https://sponsor.ajay.app/) も統合）、Jamendo、Audius、SoundCloud を検索し音楽を再生
- アルバム（Last.fm と Discogs を利用）、アルバムの表示、アーティストと曲名から曲を自動探索（開発中で、時々調子が悪いです)
- 曲の再生キュー : 再生リストとしてエクスポートも可能
- 保存した再生リストの読み込み (json ファイルに保存)
- last.fm の Scrobbling（「再生中」のステータス更新と共に）
- レビュー付きの最新リリース - 曲とアルバム
- ジャンル別に探索
- ラジオモード（似た曲を再生キューに自動で追加）
- ダウンロード無制限 (youtube を利用)
- 歌詞を取得
- 人気順に探索
- 曲をお気に入りに登録
- 端末内のライブラリから視聴
- アカウント不要
- 広告なし
- 行動規約なし
- 使用許諾契約への同意なし

## 開発への参加

最初に [Contribution Guidelines](https://nukeop.gitbook.io/nuclear/contributing/contribution-guidelines)（貢献者のガイドライン）をご確認ください。

開発モードで Nuclear を実行する方法は、[Development Process](https://nukeop.gitbook.io/nuclear/developer-resources/development-process) の解説文書をご覧ください。

## コミュニティが管理するパッケージ

様々なパッケージ管理の一覧です。一部は第三者によって管理されています。保守管理に感謝します。

| パッケージ種別   | リンク                                                               | 保守担当者                                   | インストール方法                           |
|:--------------:|:------------------------------------------------------------------:|:--------------------------------------------:|:---------------------------------------------:|
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-bin/             | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-bin                     |
| AUR (Arch)     | https://aur.archlinux.org/packages/nuclear-player-git              | [nukeop](https://github.com/nukeop)          | yay -s nuclear-player-git                     |
| Choco (Win)    | https://chocolatey.org/packages/nuclear/                           | [JourneyOver](https://github.com/JourneyOver)| choco install nuclear                         |
| GURU (Gentoo)  | https://github.com/gentoo/guru/tree/master/media-sound/nuclear-bin | Orphaned    | emerge nuclear-bin                            |
| Homebrew (Mac) | https://formulae.brew.sh/cask/nuclear                              | Homebrew                                     | brew install --cask nuclear                   |
| Snap           | https://snapcraft.io/nuclear                                       | [nukeop](https://github.com/nukeop)          | sudo snap install nuclear                     |
| Flatpak        | https://flathub.org/apps/details/org.js.nuclear.Nuclear            | [nukeop](https://github.com/nukeop)          | flatpak install flathub org.js.nuclear.Nuclear|
| Void Linux     | https://github.com/machadofguilherme/nuclear-template              | [machadofguilherme](https://github.com/machadofguilherme) | See readme


## コミュニティによる翻訳
Nuclear は、既に多くの言語に翻訳されており、また追加したいと望む貢献者を求めています。

[Crowdin](https://crowdin.com/project/nuclear) で翻訳を管理しています。あなたの言語が対応するかを確認し、翻訳状況を追跡して、Nuclear の翻訳に協力してください。

## スクリーンショット

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

## ライセンス

本プログラムは、自由ソフトウェアです: フリーソフトウェア財団が発行する、GNU Affero 一般公衆ライセンスのバージョン3、または（あなたの選択により）それ以降の条件に基づいて、再配布や修正が可能です。

## 帰属
使用される SponsorBlock のデータは、[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)のライセンスで、以下のから提供されています。https://sponsor.ajay.app/