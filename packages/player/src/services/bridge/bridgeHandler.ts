import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { z } from 'zod';

import { errorMessage } from '../../utils/error';
import { BridgeCommand, BridgeEvent } from '../tauri/bridge';
import { dispatch } from './bridgeDispatcher';
import { initBridgeNotifier } from './bridgeNotifier';

const bridgeRequestSchema = z.object({
  traceId: z.string(),
  method: z.string(),
  params: z.record(z.string(), z.unknown()).default({}),
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
  invoke(BridgeCommand.respond, { response });

const handleRequest = async (request: BridgeRequest): Promise<void> => {
  try {
    const data = await dispatch(request.method, request.params);
    await respond({
      traceId: request.traceId,
      status: 'success',
      // Void methods return undefined, which gets dropped from JSON serialization.
      // Rust expects the field to exist, so we coerce to null.
      data: data ?? null,
    });
  } catch (error) {
    await respond({
      traceId: request.traceId,
      status: 'error',
      error: errorMessage(error),
    });
  }
};

export const initBridgeHandler = async (): Promise<void> => {
  await listen(BridgeEvent.request, (event) => {
    const request = bridgeRequestSchema.parse(event.payload);
    void handleRequest(request);
  });

  initBridgeNotifier();
};
