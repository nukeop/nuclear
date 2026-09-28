import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, resolve } from 'node:path';

import { releaseLayout } from './release-layout.mjs';

class ReleaseAsset {
  constructor(
    artifactsDir,
    { artifact, path, name = basename(path), updaterPlatforms = [] },
  ) {
    this.source = join(artifactsDir, artifact, path);
    this.name = name;
    this.updaterPlatforms = updaterPlatforms;
  }

  get files() {
    const file = { source: this.source, name: this.name };
    if (this.updaterPlatforms.length === 0) {
      return [file];
    }

    const signature = {
      source: `${this.source}.sig`,
      name: `${this.name}.sig`,
    };
    return [file, signature];
  }

  updaterEntries(url) {
    return this.updaterPlatforms.map((platform) => [
      platform,
      { signature: this.#signature, url },
    ]);
  }

  get #signature() {
    return readFileSync(`${this.source}.sig`, 'utf-8');
  }
}

export class Release {
  #version;
  #repository;
  #notes;
  #artifactsDir;
  #assets;

  constructor({ version, repository, notes, artifactsDir }) {
    this.#version = version;
    this.#repository = repository;
    this.#notes = notes;
    this.#artifactsDir = resolve(artifactsDir);
    this.#assets = releaseLayout(version).map(
      (layout) => new ReleaseAsset(this.#artifactsDir, layout),
    );
  }

  verifyArtifacts() {
    const expected = this.#files.map(({ source }) => source);
    const found = listFiles(this.#artifactsDir);

    failIfAny(
      'Missing release assets',
      expected.filter((source) => !found.includes(source)),
    );
    failIfAny(
      'Unexpected files in build artifacts',
      found.filter((source) => !expected.includes(source)),
    );
  }

  writeTo(outDir) {
    mkdirSync(outDir, { recursive: true });
    this.#files.forEach(({ source, name }) =>
      copyFileSync(source, join(outDir, name)),
    );
    writeFileSync(
      join(outDir, 'latest.json'),
      JSON.stringify(this.#updaterManifest(), null, 2),
    );
  }

  get #files() {
    return this.#assets.flatMap((asset) => asset.files);
  }

  #updaterManifest() {
    return {
      version: this.#version,
      notes: this.#notes,
      pub_date: new Date().toISOString(),
      platforms: Object.fromEntries(
        this.#assets.flatMap((asset) =>
          asset.updaterEntries(this.#downloadUrl(asset.name)),
        ),
      ),
    };
  }

  #downloadUrl(assetName) {
    const tag = encodeURIComponent(`player@${this.#version}`);
    return `https://github.com/${this.#repository}/releases/download/${tag}/${encodeURIComponent(assetName)}`;
  }
}

const listFiles = (dir) =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));

const failIfAny = (message, items) => {
  if (items.length > 0) {
    throw new Error(`${message}:\n${items.join('\n')}`);
  }
};
