import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CHANGELOG_PATH = 'packages/player/changelog.json';

const runGit = (cwd, args) =>
  execFileSync('git', args, { cwd, encoding: 'utf-8' }).trim();

export const rootDir = runGit(process.cwd(), ['rev-parse', '--show-toplevel']);

export const git = (...args) => runGit(rootDir, args);

export function findPreviousTag(version) {
  return git(
    'describe',
    '--tags',
    '--abbrev=0',
    '--match',
    'player@*',
    '--exclude',
    `player@${version}`,
    'HEAD',
  );
}

export function readChangelog() {
  return JSON.parse(readFileSync(resolve(rootDir, CHANGELOG_PATH), 'utf-8'));
}

export function readChangelogAt(ref) {
  return JSON.parse(git('show', `${ref}:${CHANGELOG_PATH}`));
}

export function findNewEntries(changelog, previousChangelog) {
  const releasedDescriptions = new Set(
    previousChangelog.map((entry) => entry.description),
  );
  return changelog.filter(
    (entry) => !releasedDescriptions.has(entry.description),
  );
}

export function findReleaseEntries(version) {
  return findNewEntries(
    readChangelog(),
    readChangelogAt(findPreviousTag(version)),
  );
}
