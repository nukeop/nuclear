import type { SoundStatus } from '@nuclearplayer/hifi';
import type { PluginEventMap } from '@nuclearplayer/plugin-sdk';

import { useSoundStore } from '../stores/soundStore';
import { secondsToMs } from '../utils/time';
import { eventBus } from './eventBus';

type PositionEvent = {
  [E in keyof PluginEventMap]: PluginEventMap[E] extends { positionMs: number }
    ? E
    : never;
}[keyof PluginEventMap];

const transitionEvents: Partial<
  Record<SoundStatus, Partial<Record<SoundStatus, PositionEvent>>>
> = {
  playing: {
    paused: 'playbackPaused',
    stopped: 'playbackStopped',
  },
  paused: {
    playing: 'playbackResumed',
    stopped: 'playbackStopped',
  },
};

export const initPlaybackEventBridge = (): (() => void) =>
  useSoundStore.subscribe((state, prevState) => {
    const event = transitionEvents[prevState.status]?.[state.status];
    if (event) {
      eventBus.emit(event, { positionMs: secondsToMs(prevState.seek) });
    }
  });
