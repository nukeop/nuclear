import { invoke } from '@tauri-apps/api/core';

import { errorMessage } from '../../utils/error';
import { Logger } from '../logger';

const startServer = async () => {
  const port = await invoke<number>('remote_control_start');
  Logger['remote-control'].info(
    `Remote control server started on http://0.0.0.0:${port}`,
  );
};

export const initRemoteControlHandler = async () => {
  try {
    await startServer();
  } catch (err) {
    Logger['remote-control'].error(
      `Failed to start remote control server: ${errorMessage(err)}`,
    );
  }
};
