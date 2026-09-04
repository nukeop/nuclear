import { releaseUrl, version } from './version';

export const platforms = [
  {
    name: 'macOS',
    icon: 'simple-icons:apple',
    url: releaseUrl(`Nuclear_${version}_aarch64.dmg`),
  },
  {
    name: 'Windows',
    icon: 'simple-icons:windows',
    url: releaseUrl(`Nuclear_${version}_x64-setup.exe`),
  },
  {
    name: 'Linux',
    icon: 'simple-icons:linux',
    url: releaseUrl(`Nuclear_${version}_amd64.AppImage`),
  },
];

export const repositories = [
  {
    name: 'Flathub',
    icon: 'simple-icons:flathub',
    url: 'https://flathub.org/apps/com.nuclearplayer.Nuclear',
  },
  {
    name: 'Snapcraft',
    icon: 'simple-icons:snapcraft',
    url: 'https://snapcraft.io/nuclear',
  },
  {
    name: 'AUR',
    icon: 'simple-icons:archlinux',
    url: 'https://aur.archlinux.org/packages/nuclear-player-bin',
  },
  {
    name: 'winget',
    icon: 'simple-icons:windows',
    url: 'https://winget.run/pkg/nukeop/nuclear',
  },
];
