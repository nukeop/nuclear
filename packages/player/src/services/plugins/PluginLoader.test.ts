import { type Mock } from 'vitest';

import { PluginManifest } from '@nuclearplayer/plugin-sdk';

import { PluginFsMock } from '../../test/mocks/plugin-fs';
import { compilePlugin } from './pluginCompiler';
import { PluginLoader } from './PluginLoader';

vi.mock('./pluginCompiler', () => ({
  compilePlugin: vi.fn(async (path: string) => {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return 'module.exports = { onLoad(){} };';
    }
    return undefined;
  }),
}));

const mockNuclearPluginAPI = vi.fn();
vi.mock('@nuclearplayer/plugin-sdk', () => ({
  NuclearPluginAPI: class MockNuclearPluginAPI {
    constructor() {
      mockNuclearPluginAPI();
    }
    static add() {
      return 2 + 2;
    }
  },
}));

describe('PluginLoader', () => {
  let loader: PluginLoader;

  const baseManifest: PluginManifest = {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test description',
    author: 'Tester',
  };

  const makeManifest = (
    overrides: Partial<
      typeof baseManifest & { main?: string; nuclear?: unknown }
    > = {},
  ) => ({
    ...baseManifest,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    PluginFsMock.reset();
    loader = new PluginLoader('/test/plugin/path');
  });

  describe('manifest validation via load()', () => {
    it('parses manifest with required fields', async () => {
      const manifest = makeManifest();
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.ts': 'module.exports = { onLoad(){} };',
      });

      const result = await loader.load();
      expect(result.metadata).toMatchObject({
        id: manifest.name,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
      });
    });

    it('throws if name missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.name;
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
      });

      await expect(loader.load()).rejects.toThrow(
        /Invalid package.json: name:/,
      );
    });

    it('throws if version missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.version;
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
      });
      await expect(loader.load()).rejects.toThrow(
        /Invalid package.json: version:/,
      );
    });

    it('throws if description missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.description;
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
      });
      await expect(loader.load()).rejects.toThrow(
        /Invalid package.json: description:/,
      );
    });

    it('throws if author missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.author;
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
      });
      await expect(loader.load()).rejects.toThrow(
        /Invalid package.json: author:/,
      );
    });
  });

  describe('entry resolution', () => {
    it('uses main field path', async () => {
      const manifest = makeManifest({ main: 'custom/entry.ts' });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/custom/entry.ts': 'module.exports = { onLoad(){} };',
      });
      const result = await loader.load();
      expect(result.instance).toBeDefined();
    });

    it('falls back to index.ts when index.js missing', async () => {
      const manifest = makeManifest();
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.ts': 'module.exports = { onEnable(){} };',
      });
      const result = await loader.load();
      expect(result.instance).toBeDefined();
    });

    it('falls back to dist/index.js after index.js/.ts/.tsx missing', async () => {
      const manifest = makeManifest();
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/dist/index.js': 'module.exports = { onEnable(){} };',
      });
      const result = await loader.load();
      expect(result.instance).toBeDefined();
    });

    it('falls back to dist/index.ts after other candidates missing', async () => {
      const manifest = makeManifest();
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/dist/index.ts': 'module.exports = { onEnable(){} };',
      });
      const result = await loader.load();
      expect(result.instance).toBeDefined();
    });

    it('throws if no entry file found', async () => {
      const manifest = makeManifest();
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
      });
      await expect(loader.load()).rejects.toThrow(
        'Could not resolve plugin entry file (main, index.js, index.ts, index.tsx, dist/index.js, dist/index.ts, dist/index.tsx)',
      );
    });
  });

  describe('plugin code evaluation via load()', () => {
    it('returns hooks object', async () => {
      const manifest = makeManifest({ main: 'index.js' });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js': 'module.exports = { onLoad(){} };',
      });
      const result = await loader.load();
      expect(result.instance).toHaveProperty('onLoad');
    });

    it('supports default export', async () => {
      const manifest = makeManifest({ main: 'index.js' });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js':
          'module.exports.default = { onEnable(){} };',
      });
      const result = await loader.load();
      expect(result.instance).toHaveProperty('onEnable');
    });

    it('throws on non-object export', async () => {
      const manifest = makeManifest({ main: 'index.js' });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js': 'module.exports = 42;',
      });
      await expect(loader.load()).rejects.toThrow(
        'Plugin must export a default object.',
      );
    });

    it('provides limited require for plugin-sdk', async () => {
      const pluginContents =
        "const { NuclearPluginAPI } = require('@nuclearplayer/plugin-sdk'); module.exports = { testAdd: NuclearPluginAPI.add() }";
      const manifest = makeManifest({ main: 'index.ts' });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.ts': pluginContents,
      });
      (compilePlugin as Mock).mockResolvedValueOnce(pluginContents);
      const result = await loader.load();
      expect(result.instance).toHaveProperty('testAdd', 4);
    });

    it('throws for unknown required modules', async () => {
      const manifest = makeManifest({ main: 'index.js' });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js':
          "require('unknown-module'); module.exports = {};",
      });
      await expect(loader.load()).rejects.toThrow(
        'Module unknown-module not found',
      );
    });
  });

  describe('load metadata assembly', () => {
    it('builds metadata including nuclear section', async () => {
      const manifest = makeManifest({
        main: 'index.js',
        nuclear: {
          displayName: 'Display Name',
          category: 'integration',
          permissions: ['net'],
        },
      });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js': 'module.exports = { onLoad(){} };',
      });
      const result = await loader.load();
      expect(result.metadata).toMatchObject({
        id: 'test-plugin',
        displayName: 'Display Name',
        category: 'integration',
        permissions: ['net'],
      });
    });

    it('adds a warning when main is missing and still loads via fallback', async () => {
      const manifest = makeManifest({
        nuclear: { permissions: [] },
      });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js': 'module.exports = { onLoad(){} };',
      });
      const result = await loader.load();
      expect(result.instance).toBeDefined();
      expect(loader.getWarnings()).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/package.json missing "main"/),
        ]),
      );
    });

    it('dedupes and sorts permissions and warns on duplicates', async () => {
      const manifest = makeManifest({
        main: 'index.js',
        nuclear: { permissions: ['net', ' net ', 'fs', 'net'] },
      });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js': 'module.exports = { onLoad(){} };',
      });
      const result = await loader.load();
      expect(result.metadata.permissions).toEqual(['fs', 'net']);
      expect(loader.getWarnings()).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/Duplicate permissions removed\./),
        ]),
      );
    });

    it('warns about unknown nuclear keys but keeps parsing', async () => {
      const manifest = makeManifest({
        main: 'index.js',
        nuclear: { permissions: ['net'], foo: 'bar' } as unknown as Record<
          string,
          unknown
        >,
      });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.js': 'module.exports = { onLoad(){} };',
      });
      await loader.load();
      expect(loader.getWarnings()).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/nuclear contains unknown keys: foo/),
        ]),
      );
    });
  });

  describe('typescript plugin compilation', () => {
    it('compiles and loads a .ts plugin', async () => {
      const manifest = makeManifest({ main: 'index.ts' });
      PluginFsMock.setReadTextFileByMap({
        '/test/plugin/path/package.json': JSON.stringify(manifest),
        '/test/plugin/path/index.ts': 'module.exports = { onLoad(){} };',
      });
      (compilePlugin as Mock).mockResolvedValueOnce(
        'module.exports = { onLoad(){} };',
      );
      const result = await loader.load();
      expect(result.instance).toHaveProperty('onLoad');
    });
  });
});
