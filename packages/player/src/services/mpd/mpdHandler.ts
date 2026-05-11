import { invoke } from '@tauri-apps/api/core';

import {
  getSetting,
  setSetting,
  useSettingsStore,
} from '../../stores/settingsStore';
import { errorMessage } from '../../utils/error';
import { Logger } from '../logger';

const MPD_ENABLED_SETTING = 'core.integrations.mpd.enabled';
const MPD_SERVER_URL_SETTING = 'core.integrations.mpd.serverUrl';

const startServer = async () => {
  const port = await invoke<number>('mpd_start');
  const url = `mpd://127.0.0.1:${port}`;
  await setSetting(MPD_SERVER_URL_SETTING, url);
  Logger.mpd.info(`MPD server started on ${url}`);
};

const stopServer = () => invoke('mpd_stop');

const watchSettings = () => {
  let previouslyEnabled = getSetting(MPD_ENABLED_SETTING) === true;

  useSettingsStore.subscribe((state) => {
    const enabled = state.getValue(MPD_ENABLED_SETTING) === true;
    if (enabled === previouslyEnabled) {
      return;
    }
    previouslyEnabled = enabled;

    if (enabled) {
      Logger.mpd.info('MPD server enabled');
      startServer().catch((err) =>
        Logger.mpd.error(`Failed to start MPD server: ${errorMessage(err)}`),
      );
    } else {
      Logger.mpd.info('MPD server disabled');
      stopServer().catch((err) =>
        Logger.mpd.error(`Failed to stop MPD server: ${errorMessage(err)}`),
      );
    }
  });
};

export const initMpdHandler = async () => {
  watchSettings();

  if (getSetting(MPD_ENABLED_SETTING) === true) {
    Logger.mpd.info('MPD server enabled on startup');
    await startServer();
  }
};
