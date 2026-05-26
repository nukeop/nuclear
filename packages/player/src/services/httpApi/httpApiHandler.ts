import { invoke } from '@tauri-apps/api/core';
import { emit } from '@tauri-apps/api/event';

import { DEFAULT_THEME_ID } from '@nuclearplayer/themes';

import { useQueueStore } from '../../stores/queueStore';
import { getSetting, useSettingsStore } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';
import { errorMessage } from '../../utils/error';
import { Logger } from '../logger';

const JAM_ENABLED_SETTING = 'core.integrations.jam.enabled';

type Unsubscribe = () => void;

const watchQueue = (): Unsubscribe => {
  const getSnapshot = () => {
    const { items, currentIndex } = useQueueStore.getState();
    return { items, currentIndex };
  };

  emit('remote:queue', getSnapshot());

  return useQueueStore.subscribe(() => {
    emit('remote:queue', getSnapshot());
  });
};

const watchPlayback = (): Unsubscribe => {
  const getSnapshot = () => {
    const { status, seek, duration } = useSoundStore.getState();
    return { status, seek, duration };
  };

  emit('remote:playback', getSnapshot());

  return useSoundStore.subscribe(() => {
    emit('remote:playback', getSnapshot());
  });
};

const getSettingsSnapshot = () => {
  const getValue = useSettingsStore.getState().getValue;
  return {
    shuffle: (getValue('core.playback.shuffle') as boolean) ?? false,
    repeat: (getValue('core.playback.repeat') as string) ?? 'off',
    discovery: (getValue('core.playback.discovery') as boolean) ?? false,
    language: (getValue('core.general.language') as string) ?? 'en_US',
    dark: (getValue('core.theme.dark') as boolean) ?? false,
    themeId: (getValue('core.theme.active.id') as string) ?? DEFAULT_THEME_ID,
  };
};

const watchSettingsForRemote = (): Unsubscribe => {
  emit('remote:settings', getSettingsSnapshot());

  return useSettingsStore.subscribe(() => {
    emit('remote:settings', getSettingsSnapshot());
  });
};

let activeUnsubscribers: Unsubscribe[] = [];

const startServer = async () => {
  const port = await invoke<number>('http_api_start');
  Logger['http-api'].info(`HTTP API server started on http://0.0.0.0:${port}`);
  activeUnsubscribers = [
    watchQueue(),
    watchPlayback(),
    watchSettingsForRemote(),
  ];
};

const stopServer = async () => {
  await invoke('http_api_stop');
  activeUnsubscribers.forEach((unsubscribe) => unsubscribe());
  activeUnsubscribers = [];
};

const watchEnabledSetting = () => {
  let previouslyEnabled = getSetting(JAM_ENABLED_SETTING) === true;

  useSettingsStore.subscribe((state) => {
    const enabled = state.getValue(JAM_ENABLED_SETTING) === true;
    if (enabled === previouslyEnabled) {
      return;
    }
    previouslyEnabled = enabled;

    if (enabled) {
      Logger['http-api'].info('HTTP API server enabled');
      startServer().catch((err) =>
        Logger['http-api'].error(
          `Failed to start HTTP API server: ${errorMessage(err)}`,
        ),
      );
    } else {
      Logger['http-api'].info('HTTP API server disabled');
      stopServer().catch((err) =>
        Logger['http-api'].error(
          `Failed to stop HTTP API server: ${errorMessage(err)}`,
        ),
      );
    }
  });
};

export const initHttpApiHandler = async () => {
  watchEnabledSetting();

  if (getSetting(JAM_ENABLED_SETTING) === true) {
    Logger['http-api'].info('HTTP API server enabled on startup');
    await startServer();
  }
};
