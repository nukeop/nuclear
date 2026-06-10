/**
 * Nuclear Player - Plugin Compiler (browser/Tauri, esbuild-wasm)
 *
 * Why this exists:
 * - We need to compile third-party plugins written in TS/TSX inside the Tauri webview,
 *   where we don't have Node's fs or a native esbuild binary.
 * - esbuild-wasm runs in the browser context but has limited filesystem APIs.
 * - Vite HMR and test environments may reload this module multiple times, so we must
 *   prevent calling esbuild.initialize() more than once per JS context.
 *
 * Core ideas:
 * - Keep a single, typed global singleton for the esbuild-wasm runtime to survive HMR
 *   and avoid the "Cannot call initialize more than once" error.
 * - Feed the entry file content to esbuild and handle ALL path resolutions/loads via
 *   Tauri's readTextFile (a virtual filesystem plugin), never touching the real fs.
 * - Only compile TS/TSX. For plain JS we skip compilation and just read the file.
 * - Externalize bare module imports (e.g., @nuclearplayer/plugin-sdk) so plugins don't
 *   accidentally try to bundle our runtime dependencies.
 * - Cache compiled bundles per entry path, invalidated by re-hashing every file
 *   that participated in the previous build (see CompileCacheEntry below).
 */
import { dirname, extname, isAbsolute, resolve } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import type * as EsbuildTypes from 'esbuild-wasm';
import wasmUrl from 'esbuild-wasm/esbuild.wasm?url';

type EsbuildModule = typeof EsbuildTypes & { stop?: () => void };

type EsbuildGlobal = {
  mod: EsbuildModule | null;
  initialized: boolean;
  initPromise: Promise<void> | null;
};

declare global {
  var __NUCLEAR_ESBUILD_WASM__: EsbuildGlobal | undefined;
}

/**
 * Return the single esbuild-wasm runtime state shared across this JS context.
 *
 * Why globalThis:
 * - Vite HMR can re-evaluate this module many times in dev. Module-local singletons
 *   would be lost on every re-evaluation, but esbuild's internal state isn't.
 * - By storing the state on globalThis, we preserve the "initialized once" guarantee
 *   across HMR and repeated imports within the same window/worker.
 * - Each worker/window has its own globalThis. That's okay: we want one esbuild
 *   instance per JS context (not globally across processes).
 *
 * Typing:
 * - The global is declared via an ambient type (declare global) above, so we avoid
 *   any/unknown casts and keep the state strongly typed.
 */
function getEsbuildState(): EsbuildGlobal {
  if (!globalThis.__NUCLEAR_ESBUILD_WASM__) {
    globalThis.__NUCLEAR_ESBUILD_WASM__ = {
      mod: null,
      initialized: false,
      initPromise: null,
    };
  }
  return globalThis.__NUCLEAR_ESBUILD_WASM__;
}

const es = getEsbuildState();

/**
 * Compile cache, keyed by entry path.
 *
 * Because we bundle, the output depends on EVERY file the build touched, not
 * just the entry. A cache keyed by the entry's content hash alone would serve
 * stale bundles when an imported file changes (edit ./utils.ts, reload, get
 * stale code). So each entry records the content hash of all of its
 * inputs, collected in the onLoad hook during the build. Before reusing a
 * cached bundle we re-read and re-hash every recorded input; any mismatch or
 * read failure triggers a recompile.
 *
 * Keying by entry path (instead of path + hash) also bounds the cache to one
 * entry per plugin, so repeated edit/reload cycles don't accumulate dead
 * bundles in memory.
 */
type CompileCacheEntry = {
  inputHashes: Map<string, string>;
  code: string;
};

const cache = new Map<string, CompileCacheEntry>();

const isTs = (p: string) => p.endsWith('.ts') || p.endsWith('.tsx');

const tryRead = async (path: string): Promise<string | null> => {
  try {
    return await readTextFile(path);
  } catch {
    return null;
  }
};

/**
 * Initialize esbuild-wasm exactly once within this JS context.
 *
 * Why this pattern:
 * - esbuild-wasm throws if initialize() is called more than once per context.
 * - HMR re-executes this module. Local flags would reset, but esbuild remains
 *   initialized internally, so a naive second initialize() would crash.
 * - We keep the init state on a global singleton, and expose an initPromise so
 *   concurrent callers share the same in-flight initialization.
 */
async function ensureInit() {
  if (es.initialized) {
    return;
  }
  if (!es.initPromise) {
    es.initPromise = (async () => {
      if (!es.mod) {
        es.mod = await import('esbuild-wasm');
      }
      await es.mod.initialize({ wasmURL: wasmUrl, worker: false });
      es.initialized = true;
    })();
  }
  await es.initPromise;
}

/**
 * Wait for initialization and return the esbuild module instance.
 * Kept separate so call-sites don't need to remember to call ensureInit().
 */
async function getEsbuild(): Promise<EsbuildModule> {
  await ensureInit();
  return es.mod!;
}

const simpleHash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h.toString(16);
};

const isCacheEntryFresh = async (
  entry: CompileCacheEntry,
): Promise<boolean> => {
  for (const [path, hash] of entry.inputHashes) {
    const contents = await tryRead(path);
    if (contents === null || simpleHash(contents) !== hash) {
      return false;
    }
  }
  return true;
};

export async function compilePlugin(
  entryPath: string,
): Promise<string | undefined> {
  if (!isTs(entryPath)) {
    return undefined;
  }

  const cached = cache.get(entryPath);
  if (cached && (await isCacheEntryFresh(cached))) {
    return cached.code;
  }

  const entrySource = await readTextFile(entryPath);

  const inputHashes = new Map<string, string>([
    [entryPath, simpleHash(entrySource)],
  ]);

  const mod = await getEsbuild();
  const entryDir = await dirname(entryPath);
  const entryLoader: EsbuildTypes.Loader = entryPath.endsWith('.tsx')
    ? 'tsx'
    : entryPath.endsWith('.ts')
      ? 'ts'
      : 'js';

  const result = await mod.build({
    // Feed the entry file through "stdin" so esbuild never tries to open it
    // from a real filesystem. In WASM/web there is no Node fs, and letting
    // esbuild fall back to its default fs behavior will cause errors.
    //
    // - sourcefile: preserves meaningful file names in stack traces and is used
    //   as the base for resolving relative imports.
    // - resolveDir: tells esbuild where to resolve "./" and "../" from.
    // - loader: matches the entry extension so esbuild parses TS/TSX correctly.
    stdin: {
      contents: entrySource,
      sourcefile: entryPath,
      loader: entryLoader,
    },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'browser',
    target: ['es2022'],
    sourcemap: 'inline',
    // Use the automatic JSX runtime. The PluginLoader's require shim provides
    // 'react/jsx-runtime', and the bare import esbuild emits for it gets
    // externalized by our onResolve below. Without this, esbuild defaults to
    // the classic transform (React.createElement), and any TSX plugin that
    // doesn't manually `import React` compiles fine but explodes at eval time
    // with "React is not defined".
    jsx: 'automatic',
    // Do not bundle our host SDK. Plugins import it at runtime from the app,
    // not from the plugin bundle.
    external: ['@nuclearplayer/plugin-sdk'],

    // Keep a neutral working directory. Real resolution happens inside our
    // virtual "tauri-fs" plugin (below).
    absWorkingDir: '/',

    // Inline tsconfig so esbuild doesn't try to read tsconfig.json from disk.
    tsconfigRaw: { compilerOptions: {} },

    logLevel: 'silent',

    // A tiny "virtual filesystem" implemented with Tauri's readTextFile.
    // The goal is to keep esbuild away from any Node fs code paths that
    // don't exist in WASM/web.
    plugins: [
      {
        name: 'tauri-fs',
        setup(build) {
          // Unify all "where is this import?" questions behind a single rule set,
          // and force them into a custom namespace ("tauri-fs"). Anything that
          // lands in this namespace will be loaded by our onLoad hook below,
          // using Tauri's readTextFile instead of Node's fs.
          build.onResolve({ filter: /.*/ }, async (args) => {
            if (args.kind === 'entry-point') {
              return { path: entryPath, namespace: 'tauri-fs' };
            }

            if (await isAbsolute(args.path)) {
              return { path: args.path, namespace: 'tauri-fs' };
            }

            if (/^\.\.?[/\\]/.test(args.path)) {
              const importerDir = args.importer
                ? await dirname(args.importer)
                : entryDir;
              const resolved = await resolve(importerDir, args.path);
              return { path: resolved, namespace: 'tauri-fs' };
            }

            return { path: args.path, external: true };
          });
          // Given a path in our "tauri-fs" namespace, fetch the file content
          // via Tauri's filesystem API and tell esbuild how to treat it.
          build.onLoad(
            { filter: /.*/, namespace: 'tauri-fs' },
            async (args) => {
              if (args.path === entryPath) {
                return {
                  contents: entrySource,
                  loader: entryLoader,
                };
              }

              let hasExt = false;
              try {
                const ext = await extname(args.path);
                hasExt = ext !== '';
              } catch {
                // Tauri's extname throws when the path has no extension
              }
              const candidates: string[] = [];

              if (hasExt) {
                candidates.push(args.path);
              } else {
                candidates.push(
                  args.path + '.ts',
                  args.path + '.tsx',
                  args.path + '.js',
                  args.path + '/index.ts',
                  args.path + '/index.tsx',
                  args.path + '/index.js',
                );
              }

              for (const p of candidates) {
                const contents = await tryRead(p);
                if (contents != null) {
                  // Record the resolved file in the freshness manifest so the
                  // cache invalidates when this import changes, not just when
                  // the entry does.
                  inputHashes.set(p, simpleHash(contents));
                  const loader: EsbuildTypes.Loader = p.endsWith('.tsx')
                    ? 'tsx'
                    : p.endsWith('.ts')
                      ? 'ts'
                      : 'js';
                  return { contents, loader };
                }
              }

              throw new Error(`Module not found (tauri-fs): ${args.path}`);
            },
          );
          // Bare module specifiers are handled as external in the unified onResolve above.
        },
      },
    ],
  });
  if (!result.outputFiles || !result.outputFiles[0]) {
    throw new Error('Plugin compile failed');
  }
  const code = result.outputFiles[0].text;
  cache.set(entryPath, { inputHashes, code });
  return code;
}
