export const releaseLayout = (version) => [
  {
    artifact: 'macos-aarch64',
    path: `dmg/Nuclear_${version}_aarch64.dmg`,
  },
  {
    artifact: 'macos-aarch64',
    path: 'macos/Nuclear.app.tar.gz',
    name: `Nuclear_${version}_aarch64.app.tar.gz`,
    updaterPlatforms: ['darwin-aarch64', 'darwin-aarch64-app'],
  },
  {
    artifact: 'macos-x64',
    path: `dmg/Nuclear_${version}_x64.dmg`,
  },
  {
    artifact: 'macos-x64',
    path: 'macos/Nuclear.app.tar.gz',
    name: `Nuclear_${version}_x64.app.tar.gz`,
    updaterPlatforms: ['darwin-x86_64', 'darwin-x86_64-app'],
  },
  {
    artifact: 'linux-x64',
    path: `appimage/Nuclear_${version}_amd64.AppImage`,
    updaterPlatforms: ['linux-x86_64', 'linux-x86_64-appimage'],
  },
  {
    artifact: 'linux-x64',
    path: `deb/Nuclear_${version}_amd64.deb`,
    updaterPlatforms: ['linux-x86_64-deb'],
  },
  {
    artifact: 'linux-x64',
    path: `rpm/Nuclear-${version}-1.x86_64.rpm`,
    updaterPlatforms: ['linux-x86_64-rpm'],
  },
  {
    artifact: 'windows-x64',
    path: `msi/Nuclear_${version}_x64_en-US.msi`,
    updaterPlatforms: ['windows-x86_64', 'windows-x86_64-msi'],
  },
  {
    artifact: 'windows-x64',
    path: `nsis/Nuclear_${version}_x64-setup.exe`,
    updaterPlatforms: ['windows-x86_64-nsis'],
  },
  {
    artifact: 'flatpak',
    path: `Nuclear_${version}_x86_64.flatpak`,
  },
  {
    artifact: 'snap',
    path: `nuclear_${version}_amd64.snap`,
  },
];
