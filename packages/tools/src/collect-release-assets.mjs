#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { Release } from './release.mjs';

const USAGE =
  'Usage: collect-release-assets.mjs --version <version> --notes <file> --artifacts <dir> --out <dir> --repository <owner/repo>';
const OPTION_NAMES = ['version', 'notes', 'artifacts', 'out', 'repository'];

const { values: options } = parseArgs({
  options: Object.fromEntries(
    OPTION_NAMES.map((option) => [option, { type: 'string' }]),
  ),
});

const missingOptions = OPTION_NAMES.filter((option) => !options[option]);
if (missingOptions.length > 0) {
  console.error(USAGE);
  console.error(`Missing options: ${missingOptions.join(', ')}`);
  process.exit(1);
}

const release = new Release({
  version: options.version,
  repository: options.repository,
  notes: readFileSync(options.notes, 'utf-8').trimEnd(),
  artifactsDir: options.artifacts,
});

release.verifyArtifacts();
release.writeTo(options.out);
