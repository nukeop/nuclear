import { invoke } from '@tauri-apps/api/core';
import { emit } from '@tauri-apps/api/event';

import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';
import { errorMessage } from '../../utils/error';
import { Logger } from '../logger';

const startServer = async () => {
  const port = await invoke<number>('http_api_start');
  Logger['http-api'].info(`HTTP API server started on http://0.0.0.0:${port}`);
};

const watchQueue = () => {
  const getSnapshot = () => {
    const { items, currentIndex } = useQueueStore.getState();
    return { items, currentIndex };
  };

  emit('remote:queue', getSnapshot());

  useQueueStore.subscribe(() => {
    emit('remote:queue', getSnapshot());
  });
};

const watchPlayback = () => {
  const getSnapshot = () => {
    const { status, seek, duration } = useSoundStore.getState();
    return { status, seek, duration };
  };

  emit('remote:playback', getSnapshot());

  useSoundStore.subscribe(() => {
    emit('remote:playback', getSnapshot());
  });
};

const getSettingsSnapshot = () => {
  const getValue = useSettingsStore.getState().getValue;
  return {
    shuffle: (getValue('core.playback.shuffle') as boolean) ?? false,
    repeat: (getValue('core.playback.repeat') as string) ?? 'off',
    discovery: (getValue('core.playback.discovery') as boolean) ?? false,
  };
};

const watchSettings = () => {
  emit('remote:settings', getSettingsSnapshot());

  useSettingsStore.subscribe(() => {
    emit('remote:settings', getSettingsSnapshot());
  });
};

export const initHttpApiHandler = async () => {
  try {
    await startServer();
    watchQueue();
    watchPlayback();
    watchSettings();
  } catch (err) {
    Logger['http-api'].error(
      `Failed to start HTTP API server: ${errorMessage(err)}`,
    );
  }
};
