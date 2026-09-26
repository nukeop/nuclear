import { releaseUrl, version } from './version';

export type OperatingSystem = 'macos' | 'windows' | 'linux';

export type DownloadFile = {
  label: string;
  format: string;
  url: string;
  featured?: boolean;
};

export type PackageManager = {
  name: string;
  icon: string;
  url: string;
  command: string;
};

export type Platform = {
  id: OperatingSystem;
  name: string;
  icon: string;
  summary: string;
  files: [DownloadFile, ...DownloadFile[]];
  packageManagers: PackageManager[];
};

export const platforms: Platform[] = [
  {
    id: 'macos',
    name: 'macOS',
    summary: 'Choose the build for your chip',
    icon: 'simple-icons:apple',
    files: [
      {
        label: 'Apple Silicon',
        format: '.dmg',
        url: releaseUrl(`Nuclear_${version}_aarch64.dmg`),
        featured: true,
      },
      {
        label: 'Intel',
        format: '.dmg',
        url: releaseUrl(`Nuclear_${version}_x64.dmg`),
        featured: true,
      },
    ],
    packageManagers: [
      {
        name: 'Homebrew',
        icon: 'simple-icons:homebrew',
        url: 'https://github.com/NuclearPlayer/homebrew-tap',
        command: 'brew install --cask nuclearplayer/tap/nuclear',
      },
    ],
  },
  {
    id: 'windows',
    name: 'Windows',
    summary: '64-bit installer, .exe',
    icon: 'simple-icons:windows',
    files: [
      {
        label: '64-bit installer',
        format: '.exe',
        url: releaseUrl(`Nuclear_${version}_x64-setup.exe`),
        featured: true,
      },
      {
        label: '64-bit MSI package',
        format: '.msi',
        url: releaseUrl(`Nuclear_${version}_x64_en-US.msi`),
      },
    ],
    packageManagers: [
      {
        name: 'winget',
        icon: 'simple-icons:windows',
        url: 'https://winget.run/pkg/nukeop/nuclear',
        command: 'winget install nukeop.nuclear',
      },
    ],
  },
  {
    id: 'linux',
    name: 'Linux',
    summary: 'AppImage, runs on any distribution',
    icon: 'simple-icons:linux',
    files: [
      {
        label: 'Any distribution',
        format: '.AppImage',
        url: releaseUrl(`Nuclear_${version}_amd64.AppImage`),
        featured: true,
      },
      {
        label: 'Debian, Ubuntu',
        format: '.deb',
        url: releaseUrl(`Nuclear_${version}_amd64.deb`),
      },
      {
        label: 'Fedora, openSUSE',
        format: '.rpm',
        url: releaseUrl(`Nuclear-${version}-1.x86_64.rpm`),
      },
      {
        label: 'Flatpak bundle',
        format: '.flatpak',
        url: releaseUrl('nuclear-music-player.flatpak'),
      },
    ],
    packageManagers: [
      {
        name: 'Flathub',
        icon: 'simple-icons:flathub',
        url: 'https://flathub.org/apps/com.nuclearplayer.Nuclear',
        command: 'flatpak install flathub com.nuclearplayer.Nuclear',
      },
      {
        name: 'Snapcraft',
        icon: 'simple-icons:snapcraft',
        url: 'https://snapcraft.io/nuclear',
        command: 'sudo snap install nuclear',
      },
      {
        name: 'AUR',
        icon: 'simple-icons:archlinux',
        url: 'https://aur.archlinux.org/packages/nuclear-player-bin',
        command: 'yay -S nuclear-player-bin',
      },
    ],
  },
];

export const packageManagers = platforms.flatMap(
  (platform) => platform.packageManagers,
);

export const macQuarantineCommand =
  'sudo xattr -r -d com.apple.quarantine /Applications/Nuclear.app';
