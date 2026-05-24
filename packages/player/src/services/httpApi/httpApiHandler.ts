import { invoke } from '@tauri-apps/api/core';
import { emit } from '@tauri-apps/api/event';

import { useQueueStore } from '../../stores/queueStore';
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

export const initHttpApiHandler = async () => {
  try {
    await startServer();
    watchQueue();
    watchPlayback();
  } catch (err) {
    Logger['http-api'].error(
      `Failed to start HTTP API server: ${errorMessage(err)}`,
    );
  }
};
