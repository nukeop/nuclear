#!/usr/bin/env node
import { findReleaseEntries } from './release-entries.mjs';
import { formatReleaseNotes } from './release-notes.mjs';

const version = process.argv[2];
if (!version) {
  console.error('Usage: generate-release-notes.mjs <version>');
  process.exit(1);
}

console.log(formatReleaseNotes(version, findReleaseEntries(version)));
