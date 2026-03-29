import * as fs from '@tauri-apps/plugin-fs';
import { WatchEvent } from '@tauri-apps/plugin-fs';
import { type Mock } from 'vitest';

vi.mock('@tauri-apps/plugin-fs', () => ({
  exists: vi.fn(),
  mkdir: vi.fn(),
  readDir: vi.fn(),
  readTextFile: vi.fn(),
  remove: vi.fn(),
  writeTextFile: vi.fn(),
  watchImmediate: vi.fn(
    async (
      _paths: string | string[] | URL | URL[],
      cb: (event: WatchEvent) => void,
    ) => {
      watchImmediateCb = cb;
      return () => {};
    },
  ),
  BaseDirectory: {
    AppData: '/home/user/.local/share/com.nuclearplayer',
  },
}));

export let watchImmediateCb: ((event: WatchEvent) => void) | null = null;

const readTextFileMap: Record<string, string> = {};

export const PluginFsMock = {
  setReadTextFile: (value: string) => {
    (fs.readTextFile as Mock).mockResolvedValue(value);
    return fs.readTextFile as Mock;
  },
  setExists: (value: boolean) => {
    (fs.exists as Mock).mockResolvedValue(value);
    return fs.exists as Mock;
  },
  setExistsFor: (path: string, baseDir: string, value: boolean) => {
    (fs.exists as Mock).mockImplementation(
      async (
        checkedPath: string,
        { baseDir: checkedBaseDir }: { baseDir: string },
      ) => {
        if (checkedPath === path && checkedBaseDir === baseDir) {
          return value;
        }
        throw new Error('fs.exists called for unknown path');
      },
    );
    return fs.exists as Mock;
  },
  setMkdir: (value: boolean | undefined) => {
    (fs.mkdir as Mock).mockResolvedValue(value);
    return fs.mkdir as Mock;
  },
  setReadDir: (value: Array<{ name: string; isDirectory: boolean }>) => {
    (fs.readDir as Mock).mockResolvedValue(value);
    return fs.readDir as Mock;
  },
  setReadDirError: (error: Error) => {
    (fs.readDir as Mock).mockRejectedValue(error);
    return fs.readDir as Mock;
  },
  setReadTextFileByMap: (value: Record<string, string>) => {
    Object.assign(readTextFileMap, value);
    (fs.readTextFile as Mock).mockImplementation(async (path: string) => {
      const keys = Object.keys(readTextFileMap);
      const keyToReturn = keys.find((key) => {
        if (path.endsWith(key)) {
          return true;
        }
      });

      if (keyToReturn) {
        return readTextFileMap[keyToReturn];
      }
      throw new Error(`fs.readTextFile called for unknown path: ${path}`);
    });
  },
  setRemove: (value: undefined = undefined) => {
    (fs.remove as Mock).mockResolvedValue(value);
    return fs.remove as Mock;
  },
  setRemoveFor: (path: string, baseDir: string, value: boolean | undefined) => {
    (fs.remove as Mock).mockImplementation(
      async (
        checkedPath: string,
        { baseDir: checkedBaseDir }: { baseDir: string },
      ) => {
        if (checkedPath === path && checkedBaseDir === baseDir) {
          return value;
        }
        throw new Error('fs.remove called for unknown path');
      },
    );
    return fs.remove as Mock;
  },
  reset: () => {
    vi.resetAllMocks();
    for (const k of Object.keys(readTextFileMap)) {
      delete readTextFileMap[k];
    }
  },
};
