#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildReleaseElement,
  getChangelogForRelease,
  prependRelease,
} from './metainfo-releases.mjs';

const version = process.argv[2];
if (!version) {
  console.error('Usage: prepare-release.mjs <version>');
  process.exit(1);
}

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const git = (...args) =>
  execFileSync('git', args, { cwd: rootDir, encoding: 'utf-8' }).trim();

const newRelease = { version, date: new Date().toLocaleDateString('sv') };

const [previousTagDate] = git(
  'tag',
  '-l',
  'player@*',
  '--sort=-creatordate',
  '--format=%(creatordate:short)',
).split('\n');
const changelog = JSON.parse(
  readFileSync(resolve(rootDir, 'packages/player/changelog.json'), 'utf-8'),
);
const entries = getChangelogForRelease(
  newRelease,
  { date: previousTagDate },
  changelog,
);

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
