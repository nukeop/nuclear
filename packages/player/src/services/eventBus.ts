import type { EventsHost } from '@nuclearplayer/plugin-sdk';

export const createEventBus = (): EventsHost => ({
  on: () => () => {},
  emit: () => {},
});

export const eventBus = createEventBus();
