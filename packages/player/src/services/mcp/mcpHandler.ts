import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { z } from 'zod';

import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import {
  apiMeta,
  DomainMeta,
  typeRegistry,
} from '@nuclearplayer/plugin-sdk/mcp';

import {
  getSetting,
  setSetting,
  useSettingsStore,
} from '../../stores/settingsStore';
import { errorMessage } from '../../utils/error';
import { Logger } from '../logger';
import { createPluginAPI } from '../plugins/createPluginAPI';
import { dispatch } from './mcpDispatcher';

const MCP_ENABLED_SETTING = 'core.integrations.mcp.enabled';
const MCP_SERVER_URL_SETTING = 'core.integrations.mcp.serverUrl';
// token is per-session, regenerated each time the server starts.
// external MCP clients need to pass it as the x-mcp-token header.
const MCP_TOKEN_SETTING = 'core.integrations.mcp.token';

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

const availableDomains = () => Object.keys(apiMeta).join(', ');

const getDomain = (name: string): DomainMeta => {
  const domain = apiMeta[name];
  if (!domain) {
    throw new Error(
      `Unknown domain "${name}". Available: ${availableDomains()}`,
    );
  }
  return domain;
};

const discoveryHandlers: Record<string, ToolHandler> = {
  list_methods: (args) =>
    Object.values(getDomain(stringArg.parse(args)).methods),
  method_details: (args) => {
    const [domainName, methodName] = stringArg.parse(args).split('.', 2);
    const domain = getDomain(domainName);
    const method = domain.methods[methodName];
    if (!method) {
      throw new Error(
        `Unknown method "${methodName}" in domain "${domainName}". Available: ${Object.keys(domain.methods).join(', ')}`,
      );
    }
    return method;
  },
  describe_type: (args) => {
    const typeName = stringArg.parse(args);
    const shape = typeRegistry[typeName];
    if (!shape) {
      throw new Error(
        `Unknown type "${typeName}". Available: ${Object.keys(typeRegistry).join(', ')}`,
      );
    }
    return shape;
  },
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
    void Logger.mcp.error(
      `MCP tool call failed (${request.toolName}): ${message}`,
    );
    await respond({
      traceId: request.traceId,
      success: false,
      error: message,
    });
  }
};

const startServer = async () => {
  const { port, token } = await invoke<{ port: number; token: string }>(
    'mcp_start',
  );
  const url = `http://127.0.0.1:${port}/mcp`;
  await setSetting(MCP_SERVER_URL_SETTING, url);
  await setSetting(MCP_TOKEN_SETTING, token);
  Logger.mcp.info(`MCP server started on ${url}`);
};

const stopServer = async () => {
  await invoke('mcp_stop');
  // clear the token so stale values don't linger in settings
  await setSetting(MCP_TOKEN_SETTING, null);
};

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
  await listen('mcp:tool-call', (event) => {
    const request = bridgeRequestSchema.parse(event.payload);
    void handleToolCall(request);
  });

  watchSettings();

  if (getSetting(MCP_ENABLED_SETTING) === true) {
    Logger.mcp.info('MCP server enabled on startup');
    await startServer();
  }
};
