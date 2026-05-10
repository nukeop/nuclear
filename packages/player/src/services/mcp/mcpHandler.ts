import { invoke } from '@tauri-apps/api/core';

import {
  getSetting,
  setSetting,
  useSettingsStore,
} from '../../stores/settingsStore';
import { errorMessage } from '../../utils/error';
import { Logger } from '../logger';

const MCP_ENABLED_SETTING = 'core.integrations.mcp.enabled';
const MCP_SERVER_URL_SETTING = 'core.integrations.mcp.serverUrl';

const startServer = async () => {
  const port = await invoke<number>('mcp_start');
  const url = `http://127.0.0.1:${port}/mcp`;
  await setSetting(MCP_SERVER_URL_SETTING, url);
  Logger.mcp.info(`MCP server started on ${url}`);
};

const stopServer = () => invoke('mcp_stop');

const watchSettings = () => {
  let previouslyEnabled = getSetting(MCP_ENABLED_SETTING) === true;

  useSettingsStore.subscribe((state) => {
    const enabled = state.getValue(MCP_ENABLED_SETTING) === true;
    if (enabled === previouslyEnabled) {
      return;
    }
    previouslyEnabled = enabled;

    if (enabled) {
      Logger.mcp.info('MCP server enabled');
      startServer().catch((err) =>
        Logger.mcp.error(`Failed to start MCP server: ${errorMessage(err)}`),
      );
    } else {
      Logger.mcp.info('MCP server disabled');
      stopServer().catch((err) =>
        Logger.mcp.error(`Failed to stop MCP server: ${errorMessage(err)}`),
      );
    }
  });
};

export const initMcpHandler = async () => {
  watchSettings();

  if (getSetting(MCP_ENABLED_SETTING) === true) {
    Logger.mcp.info('MCP server enabled on startup');
    await startServer();
  }
};
