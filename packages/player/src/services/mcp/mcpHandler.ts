import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { z } from 'zod';

import {
  apiMeta,
  NuclearPluginAPI,
  typeRegistry,
} from '@nuclearplayer/plugin-sdk';

import { getSetting, useSettingsStore } from '../../stores/settingsStore';
import { errorMessage } from '../../utils/error';
import { Logger } from '../logger';
import { createPluginAPI } from '../plugins/createPluginAPI';
import { dispatch } from './mcpDispatcher';

const MCP_ENABLED_SETTING = 'core.integrations.mcp.enabled';

const bridgeRequestSchema = z.object({
  traceId: z.string(),
  toolName: z.string(),
  arguments: z.unknown(),
});

type BridgeRequest = z.infer<typeof bridgeRequestSchema>;

type BridgeResponse = {
  traceId: string;
  success: boolean;
  data?: unknown;
  error?: string;
};

const mcpApi: NuclearPluginAPI = createPluginAPI('mcp-server', 'MCP Server');

const respond = (response: BridgeResponse) =>
  invoke('mcp_respond', { response });

const stringArg = z.string();
const paramsArg = z.record(z.string(), z.unknown()).default({});

type ToolHandler = (args: unknown) => unknown | Promise<unknown>;

const discoveryHandlers: Record<string, ToolHandler> = {
  list_methods: (args) => Object.values(apiMeta[stringArg.parse(args)].methods),
  method_details: (args) => {
    const [domain, method] = stringArg.parse(args).split('.', 2);
    return apiMeta[domain].methods[method];
  },
  describe_type: (args) => typeRegistry[stringArg.parse(args)],
};

const getToolHandler = (toolName: string): ToolHandler =>
  discoveryHandlers[toolName] ??
  ((args) => dispatch(mcpApi, toolName, paramsArg.parse(args)));

const handleToolCall = async (request: BridgeRequest): Promise<void> => {
  try {
    const handler = getToolHandler(request.toolName);
    const data = await handler(request.arguments);
    await respond({ traceId: request.traceId, success: true, data });
  } catch (error) {
    const message = errorMessage(error);
    void Logger.app.error(
      `MCP tool call failed (${request.toolName}): ${message}`,
    );
    await respond({
      traceId: request.traceId,
      success: false,
      error: message,
    });
  }
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
  await listen('mcp:tool-call', (event) => {
    const request = bridgeRequestSchema.parse(event.payload);
    void handleToolCall(request);
  });

  watchSettings();

  if (getSetting(MCP_ENABLED_SETTING) === true) {
    Logger.app.info('MCP server enabled on startup');
    await startServer();
  }
};
