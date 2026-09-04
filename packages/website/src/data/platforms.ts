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
