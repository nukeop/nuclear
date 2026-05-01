import { join } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';

import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import type {
  LoadedPlugin,
  NuclearPlugin,
  PluginManifest,
  PluginMetadata,
} from '@nuclearplayer/plugin-sdk';
import * as nuclearUI from '@nuclearplayer/ui';

import { Logger } from '../logger';
import { compilePlugin } from './pluginCompiler';
import { safeParsePluginManifest } from './pluginManifest';

export class PluginLoader {
  private path: string;
  private manifest?: PluginManifest;
  private entryPath?: string;
  private pluginCode?: string;
  private warnings: string[] = [];

  constructor(path: string) {
    this.path = path;
  }

  private async readRawPackageJson(): Promise<unknown> {
    const packageJsonPath = await join(this.path, 'package.json');
    Logger.plugins.debug(`Reading package.json from ${packageJsonPath}`);
    const packageJsonContent = await readTextFile(packageJsonPath);
    return JSON.parse(packageJsonContent);
  }

  private async readManifest(): Promise<PluginManifest> {
    const raw = await this.readRawPackageJson();
    const res = safeParsePluginManifest(raw);
    if (!res.success) {
      const msg = res.errors.join('; ');
      Logger.plugins.error(`Invalid package.json at ${this.path}: ${msg}`);
      throw new Error(`Invalid package.json: ${msg}`);
    }
    this.warnings = res.warnings;
    this.manifest = res.data;
    Logger.plugins.debug(
      `Parsed manifest for ${this.manifest.name}@${this.manifest.version}`,
    );
    return this.manifest;
  }

  private buildMetadata(manifest: PluginManifest): PluginMetadata {
    return {
      id: manifest.name,
      name: manifest.name,
      displayName: manifest.nuclear?.displayName || manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      category: manifest.nuclear?.category,
      categories: manifest.nuclear?.categories ?? [],
      icon: manifest.nuclear?.icon,
      permissions: manifest.nuclear?.permissions || [],
    };
  }

  private async resolveEntryPath(manifest: PluginManifest): Promise<string> {
    if (manifest.main) {
      const entryPath = await join(this.path, manifest.main);
      Logger.plugins.debug(`Entry path from manifest.main: ${entryPath}`);
      return entryPath;
    }
    const candidates = [
      'index.js',
      'index.ts',
      'index.tsx',
      'dist/index.js',
      'dist/index.ts',
      'dist/index.tsx',
    ];
    for (const candidate of candidates) {
      try {
        const full = await join(this.path, candidate);
        await readTextFile(full);
        Logger.plugins.debug(`Entry path resolved to ${full}`);
        return full;
      } catch {
        /* Do nothing */
      }
    }
    Logger.plugins.error(
      `Could not resolve entry file for plugin at ${this.path}`,
    );
    throw new Error(
      'Could not resolve plugin entry file (main, index.js, index.ts, index.tsx, dist/index.js, dist/index.ts, dist/index.tsx)',
    );
  }

  private async readPluginCode(entryPath: string): Promise<string> {
    Logger.plugins.debug(`Compiling plugin from ${entryPath}`);
    const compiled = await compilePlugin(entryPath);
    if (compiled != null) {
      Logger.plugins.debug(
        `Plugin compiled successfully (${compiled.length} chars)`,
      );
      this.pluginCode = compiled;
      return compiled;
    }
    Logger.plugins.debug(`Reading pre-compiled plugin code from ${entryPath}`);
    this.pluginCode = await readTextFile(entryPath);
    return this.pluginCode;
  }

  private evaluatePlugin(code: string): NuclearPlugin {
    Logger.plugins.debug('Evaluating plugin code');
    const exports = {} as Record<string, unknown>;
    const module = { exports } as { exports: unknown };
    const ALLOWED_MODULES: Record<string, unknown> = {
      '@nuclearplayer/plugin-sdk': { NuclearPluginAPI },
      '@nuclearplayer/ui': nuclearUI,
      react: React,
      'react/jsx-runtime': jsxRuntime,
    };
    const require = (id: string) => {
      if (id in ALLOWED_MODULES) {
        return ALLOWED_MODULES[id];
      }
      Logger.plugins.error(`Plugin tried to require unknown module: ${id}`);
      throw new Error(`Module ${id} not found`);
    };
    try {
      new Function('exports', 'module', 'require', code)(
        exports,
        module,
        require,
      );
    } catch (error) {
      Logger.plugins.error(
        `Plugin evaluation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }

    // @ts-expect-error exports are actually unknown
    const plugin = (module.exports as unknown).default || module.exports;

    if (!plugin || typeof plugin !== 'object') {
      Logger.plugins.error('Plugin does not export a default object');
      throw new Error('Plugin must export a default object.');
    }
    Logger.plugins.debug('Plugin code evaluated successfully');
    return plugin as NuclearPlugin;
  }

  async loadMetadata(): Promise<PluginMetadata> {
    const manifest = await this.readManifest();
    return this.buildMetadata(manifest);
  }

  async load(api?: NuclearPluginAPI): Promise<LoadedPlugin> {
    Logger.plugins.debug(`Loading plugin from ${this.path}`);
    const manifest = this.manifest ?? (await this.readManifest());
    const metadata = this.buildMetadata(manifest);
    this.entryPath = await this.resolveEntryPath(manifest);
    const code = await this.readPluginCode(this.entryPath);
    const instance = this.evaluatePlugin(code);
    if (instance.onLoad && api) {
      Logger.plugins.debug(`Calling onLoad for ${metadata.id}`);
      await instance.onLoad(api);
    }
    Logger.plugins.info(
      `Plugin ${metadata.id}@${metadata.version} loaded successfully`,
    );
    return {
      metadata,
      instance,
      path: this.path,
    };
  }

  getWarnings(): string[] {
    return this.warnings;
  }
}
