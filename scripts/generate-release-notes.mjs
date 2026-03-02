#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPE_LABELS = {
  feature: 'Feature',
  fix: 'Fix',
  improvement: 'Improvement',
  chore: 'Chore',
  plugin: 'Plugin',
  docs: 'Docs',
};

const version = process.argv[2];
if (!version) {
  console.error('Usage: generate-release-notes.mjs <version>');
  process.exit(1);
}

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const changelog = JSON.parse(
  readFileSync(resolve(rootDir, 'packages/player/changelog.json'), 'utf-8'),
);

let previousTagDate = null;
try {
  const tags = execSync(
    "git tag -l 'player@*' --sort=-creatordate --format='%(creatordate:iso-strict)'",
    { encoding: 'utf-8' },
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  if (tags.length >= 2) {
    previousTagDate = new Date(tags[1]);
  }
} catch (err) {
  console.error('Warning: could not read git tags:', err.message);
}

const entries = previousTagDate
  ? changelog.filter((entry) => new Date(entry.date + 'Z') > previousTagDate)
  : changelog;

if (entries.length === 0) {
  console.log(`Nuclear Player release v${version}`);
  process.exit(0);
}

console.log(`## What's New in v${version}\n`);
for (const entry of entries) {
  const type = TYPE_LABELS[entry.type] || entry.type;
  const tags = entry.tags?.map((tag) => `\`${tag.label}\``).join(' ') ?? '';
  const contributors =
    entry.contributors
      ?.map((name) => `@${name}`)
      .join(', ') ?? '';

  let line = `- **${type}**: ${entry.description}`;
  if (tags) {
    line += ` ${tags}`;
  }
  if (contributors) {
    line += ` - ${contributors}`;
  }
  console.log(line);
}
