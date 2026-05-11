export const BridgeEvent = {
  request: 'bridge:request',
} as const;

export const BridgeCommand = {
  respond: 'bridge_respond',
  notify: 'bridge_notify',
} as const;
