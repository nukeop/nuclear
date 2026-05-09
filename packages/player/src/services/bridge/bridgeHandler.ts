import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { z } from 'zod';

import { BridgeChannel } from '../tauri/bridge';

const bridgeRequestSchema = z.object({
  traceId: z.string(),
  method: z.string(),
  params: z.unknown(),
});

type BridgeRequest = z.infer<typeof bridgeRequestSchema>;

type BridgeSuccessResponse = {
  traceId: string;
  status: 'success';
  data: unknown;
};

type BridgeErrorResponse = {
  traceId: string;
  status: 'error';
  error: string;
};

type BridgeResponse = BridgeSuccessResponse | BridgeErrorResponse;

const respond = (response: BridgeResponse): Promise<void> =>
  invoke(BridgeChannel.respond, { response });

const handleRequest = async (request: BridgeRequest): Promise<void> => {
  throw new Error('Not implemented');
};

export const initBridgeHandler = async (): Promise<void> => {
  await listen(BridgeChannel.request, (event) => {
    const request = bridgeRequestSchema.parse(event.payload);
    void handleRequest(request);
  });
};
