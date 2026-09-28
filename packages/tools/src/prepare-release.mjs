#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildReleaseElement, prependRelease } from './metainfo-releases.mjs';
import { findReleaseEntries, git, rootDir } from './release-entries.mjs';

const version = process.argv[2];
if (!version) {
  console.error('Usage: prepare-release.mjs <version>');
  process.exit(1);
}

const newRelease = { version, date: new Date().toLocaleDateString('sv') };
const entries = findReleaseEntries(version);

const versionFiles = [
  'packages/player/package.json',
  'packages/player/src-tauri/tauri.conf.json',
];
for (const file of versionFiles) {
  const path = resolve(rootDir, file);
  const parsed = JSON.parse(readFileSync(path, 'utf-8'));
  parsed.version = version;
  writeFileSync(path, JSON.stringify(parsed, null, 2) + '\n');
}

const metainfoFile =
  'packages/player/src-tauri/resources/com.nuclearplayer.Nuclear.metainfo.xml';
const metainfoPath = resolve(rootDir, metainfoFile);
writeFileSync(
  metainfoPath,
  prependRelease(
    readFileSync(metainfoPath, 'utf-8'),
    buildReleaseElement(newRelease, entries),
  ),
);

git('add', ...versionFiles, metainfoFile);
git('commit', '-m', `player@${version}`);
git('tag', `player@${version}`);
console.log(`Created player@${version}`);
