import { appDataDir, join, normalize } from '@tauri-apps/api/path';
import { BaseDirectory, mkdir, remove } from '@tauri-apps/plugin-fs';

import { errorMessage } from '../../utils/error';
import { reportError } from '../../utils/logging';
import { ensureDir } from '../../utils/path';
import { Logger } from '../logger';
import { copyDirRecursive } from '../tauri/commands';

export const PLUGINS_DIR_NAME = 'plugins';

export const getPluginsDir = async (): Promise<string> => {
  const base = await appDataDir();
  return join(base, PLUGINS_DIR_NAME);
};

export const ensurePluginsDir = async (): Promise<string> => {
  return ensureDir(PLUGINS_DIR_NAME);
};

export const getManagedPluginPath = async (
  id: string,
  version: string,
): Promise<string> => {
  const base = await ensurePluginsDir();
  const idDir = await join(base, id);
  const versionDir = await join(idDir, version);

  return versionDir;
};

export const installPluginToManagedDir = async (
  id: string,
  version: string,
  fromPath: string,
): Promise<string> => {
  Logger.plugins.debug(`Installing plugin ${id}@${version} from ${fromPath}`);
  const destination = await getManagedPluginPath(id, version);

  // Remove existing plugin version if present
  try {
    await remove(destination, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
    Logger.plugins.debug(`Removed existing installation at ${destination}`);
  } catch (error) {
    Logger.plugins.debug(
      `fs.remove failed for ${destination}: ${errorMessage(error)}`,
    );
  }

  // Create plugin directory
  try {
    await mkdir(destination, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
    Logger.plugins.debug(`Created plugin directory at ${destination}`);
  } catch (error) {
    await reportError('plugins', {
      userMessage: 'Failed to create managed plugin directory',
      error,
    });
  }

  const appData = await appDataDir();
  const absoluteDestination = await join(appData, destination);
  Logger.plugins.debug(`Copying plugin files to ${absoluteDestination}`);
  await copyDirRecursive(fromPath, absoluteDestination);
  Logger.plugins.debug(
    `Plugin ${id}@${version} installed to ${absoluteDestination}`,
  );
  return absoluteDestination;
};

const resolveRelativeManagedPath = async (
  absolutePath: string,
): Promise<string | undefined> => {
  const normalizedPath = await normalize(absolutePath);
  const normalizedBase = await normalize(await appDataDir());
  if (!normalizedPath.startsWith(normalizedBase)) {
    return undefined;
  }
  const trimmed = normalizedPath
    .slice(normalizedBase.length)
    .replace(/^[/\\]/, '');
  return trimmed;
};

export const removeManagedPluginInstall = async (
  absolutePath: string,
): Promise<void> => {
  Logger.plugins.debug(`Removing managed plugin install at ${absolutePath}`);
  const relative = await resolveRelativeManagedPath(absolutePath);
  if (!relative) {
    Logger.plugins.error(
      `Path ${absolutePath} is not within managed plugins directory`,
    );
    throw new Error(
      'Path is not within the managed plugins directory. For safety, refusing to delete.',
    );
  }
  try {
    await remove(relative, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
    Logger.plugins.debug(`Removed managed plugin install at ${relative}`);
  } catch (error) {
    await reportError('plugins', {
      userMessage: 'Failed to remove managed plugin directory',
      error,
    });
  }
};
