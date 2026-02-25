import { normalize } from '@tauri-apps/api/path';

import { usePluginStore } from '../../stores/pluginStore';
import { useStartupStore } from '../../stores/startupStore';
import { resolveErrorMessage } from '../../utils/logging';
import { createPluginAPI } from './createPluginAPI';
import { getPluginsDir } from './pluginDir';
import { PluginLoader } from './PluginLoader';
import {
  getRegistryEntry,
  listRegistryEntries,
  setRegistryEntryWarnings,
} from './pluginRegistry';

const isManagedPath = async (absPath: string): Promise<boolean> => {
  const normalizedPath = await normalize(absPath);
  const normalizedBase = await normalize(await getPluginsDir());
  return normalizedPath.startsWith(normalizedBase);
};

export const hydratePluginsFromRegistry = async (): Promise<void> => {
  useStartupStore.getState().startStartup();
  const now = Date.now();
  const entries = (await listRegistryEntries()).sort(
    (a, b) =>
      new Date(a.installedAt).getTime() - new Date(b.installedAt).getTime(),
  );

  for (const entry of entries) {
    // TODO: Support non-managed paths (dev plugins)
    if (!(await isManagedPath(entry.path))) {
      continue;
    }
    const pluginLoadStartTime = Date.now();
    try {
      const loader = new PluginLoader(entry.path);
      const metadata = await loader.loadMetadata();
      const api = createPluginAPI(metadata.id, metadata.displayName);
      const { instance } = await loader.load(api);
      const warnings = entry.warnings ?? loader.getWarnings() ?? [];
      usePluginStore.setState((state) => ({
        plugins: {
          ...state.plugins,
          [entry.id]: {
            metadata,
            path: entry.path,
            enabled: false,
            warning: warnings.length > 0,
            warnings,
            installationMethod: entry.installationMethod,
            originalPath: entry.originalPath,
            instance,
            api,
          },
        },
      }));
      if (entry.enabled) {
        await usePluginStore.getState().enablePlugin(entry.id);
      }
    } catch (error) {
      const message = resolveErrorMessage(error);
      const current = await getRegistryEntry(entry.id);
      const merged = Array.from(
        new Set([...(current?.warnings ?? []), message]),
      );
      await setRegistryEntryWarnings(entry.id, merged);
    } finally {
      const pluginLoadFinishTime = Date.now();
      useStartupStore
        .getState()
        .setPluginDuration(
          entry.id,
          pluginLoadFinishTime - pluginLoadStartTime,
        );
    }
  }

  const startupFinishTime = Date.now();
  useStartupStore.getState().finishStartup(startupFinishTime - now);
};
