export const version = '1.49.1';
export const versionTag = `v${version}`;
export const releaseTag = `player@${version}`;
export const releaseUrl = (filename: string) =>
  `https://github.com/nukeop/nuclear/releases/download/${releaseTag}/${filename}`;
export const releaseNotesUrl = `https://github.com/nukeop/nuclear/releases/tag/${encodeURIComponent(releaseTag)}`;
