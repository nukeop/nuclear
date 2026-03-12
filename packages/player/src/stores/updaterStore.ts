import { relaunch } from '@tauri-apps/plugin-process';
import { check, type Update } from '@tauri-apps/plugin-updater';
import { create } from 'zustand';

import { Logger } from '../services/logger';
import { reportError, resolveErrorMessage } from '../utils/logging';
import { getSetting } from './settingsStore';

type UpdaterState = {
  isUpdateAvailable: boolean;
  updateInfo: Update | null;
  lastChecked: Date | null;
  isChecking: boolean;
  isDownloading: boolean;
  isInstalling: boolean;
  isReadyToRestart: boolean;
  downloadProgress: number;
  error: string | null;
  checkForUpdate: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  restartToUpdate: () => Promise<void>;
};

export const useUpdaterStore = create<UpdaterState>((set, get) => ({
  isUpdateAvailable: false,
  updateInfo: null,
  lastChecked: null,
  isChecking: false,
  isDownloading: false,
  isInstalling: false,
  isReadyToRestart: false,
  downloadProgress: 0,
  error: null,

  checkForUpdate: async () => {
    const checkEnabled = getSetting('core.updates.checkForUpdates');
    if (checkEnabled === false) {
      return;
    }

    set({ isChecking: true, error: null });
    try {
      const update = await check();
      set({
        isUpdateAvailable: update !== null,
        updateInfo: update,
        lastChecked: new Date(),
        isChecking: false,
        error: null,
      });

      if (update !== null) {
        const autoInstall = getSetting('core.updates.autoInstall');
        if (autoInstall === true) {
          await get().downloadUpdate();
        }
      }
    } catch (error) {
      const message = resolveErrorMessage(error);

      Logger.updates.error(`Failed to check for updates: ${message}`);
      set({
        isChecking: false,
        lastChecked: new Date(),
        error: resolveErrorMessage(error),
      });
    }
  },

  downloadUpdate: async () => {
    const { updateInfo } = get();
    if (!updateInfo) {
      return;
    }

    set({ isDownloading: true, downloadProgress: 0, error: null });
    let totalSize = 0;
    let downloadedSize = 0;
    try {
      await updateInfo.downloadAndInstall((event) => {
        if (event.event === 'Started' && event.data.contentLength) {
          totalSize = event.data.contentLength;
          set({ downloadProgress: 0 });
        } else if (event.event === 'Progress') {
          downloadedSize += event.data.chunkLength;
          const percentage =
            totalSize > 0 ? Math.round((downloadedSize / totalSize) * 100) : 0;
          set({ downloadProgress: percentage });
        } else if (event.event === 'Finished') {
          set({
            isDownloading: false,
            isInstalling: false,
            isReadyToRestart: true,
            downloadProgress: 100,
          });
        }
      });
    } catch (error) {
      const message = resolveErrorMessage(error);
      Logger.updates.error(`Failed to download/install update: ${message}`);
      set({
        isDownloading: false,
        isInstalling: false,
        error: message,
      });
    }
  },

  restartToUpdate: async () => {
    try {
      await relaunch();
    } catch (error) {
      await reportError('updates', {
        userMessage: 'Failed to restart for update',
        error,
      });
      set({ error: resolveErrorMessage(error) });
    }
  },
}));
