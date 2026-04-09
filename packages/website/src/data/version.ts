export const version = '1.33.0';
export const versionTag = `v${version}`;
export const releaseTag = `player@${version}`;
export const releaseUrl = (filename: string) =>
  `https://github.com/nukeop/nuclear/releases/download/${releaseTag}/${filename}`;
