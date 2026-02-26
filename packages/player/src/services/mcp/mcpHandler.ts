import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { getSetting, useSettingsStore } from '../../stores/settingsStore';
import { Logger } from '../logger';

const MCP_ENABLED_SETTING = 'core.integrations.mcp.enabled';

type BridgeRequest = {
  traceId: string;
  toolName: string;
  arguments: unknown;
};

type BridgeResponse = {
  traceId: string;
  success: boolean;
  data?: unknown;
  error?: string;
};

const respond = (response: BridgeResponse) =>
  invoke('mcp_respond', { response });

const handleToolCall = async (request: BridgeRequest): Promise<void> => {
  // TODO: route to discovery tools and dispatcher
  await respond({
    traceId: request.traceId,
    success: false,
    error: 'Not implemented yet',
  });
};

const startServer = () => invoke('mcp_start');
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
      Logger.app.info('MCP server enabled');
      void startServer();
    } else {
      Logger.app.info('MCP server disabled');
      void stopServer();
    }
  });
};

export const initMcpHandler = async () => {
  await listen<BridgeRequest>('mcp:tool-call', (event) => {
    void handleToolCall(event.payload);
  });

  watchSettings();

  if (getSetting(MCP_ENABLED_SETTING) === true) {
    Logger.app.info('MCP server enabled on startup');
    await startServer();
  }
};
