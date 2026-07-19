import { BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs';

import { Logger } from '../services/logger';
import { errorMessage } from './error';
import { reportError } from './logging';

export const ensureDir = async (
  dir: string,
  baseDir: BaseDirectory = BaseDirectory.AppData,
) => {
  try {
    const present = await exists(dir, { baseDir });
    if (!present) {
      try {
        await mkdir(dir, {
          recursive: true,
          baseDir,
        });
      } catch (error) {
        await reportError('fs', {
          userMessage: `Failed to create directory ${dir}`,
          error,
        });
      }
    }
  } catch (error) {
    Logger.fs.error(`fs.exists failed for ${dir}: ${errorMessage(error)}`);
  }
  return dir;
};
