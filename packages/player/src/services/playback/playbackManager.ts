import type { AudioSource } from '@nuclearplayer/hifi';
import type { QueueItem } from '@nuclearplayer/model';

import { useQueueStore } from '../../stores/queueStore';
import { getSetting } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';
import { eventBus } from '../eventBus';

type PlaybackSession = {
  itemId: string;
  started: boolean;
};

export type StartTrackOptions = {
  autoPlay: boolean;
};

export class PlaybackManager {
  private session: PlaybackSession | null = null;

  play(): void {
    const { status } = useSoundStore.getState();
    if (status === 'playing') {
      return;
    }
    if (status === 'paused') {
      useSoundStore.getState().play();
      return;
    }

    const item = useQueueStore.getState().getCurrentItem();
    if (!item || this.session?.itemId !== item.id) {
      return;
    }

    useSoundStore.getState().play();
    this.beginSession(item);
  }

  pause(): void {
    useSoundStore.getState().pause();
  }

  toggle(): void {
    if (useSoundStore.getState().status === 'playing') {
      this.pause();
      return;
    }
    this.play();
  }

  startTrack(
    item: QueueItem,
    source: AudioSource,
    options: StartTrackOptions,
  ): void {
    useSoundStore.getState().setSrc(source);

    if (!options.autoPlay) {
      this.session = { itemId: item.id, started: false };
      return;
    }

    useSoundStore.getState().play();

    const isResumingMidTrack = source.startPositionSeconds !== undefined;
    if (isResumingMidTrack) {
      this.session = { itemId: item.id, started: true };
      return;
    }

    this.beginSession(item);
  }

  finishTrack(): void {
    const item = useQueueStore.getState().getCurrentItem();
    if (!item) {
      return;
    }

    eventBus.emit('trackFinished', item.track);

    const repeatMode = (getSetting('core.playback.repeat') as string) ?? 'off';
    if (repeatMode === 'one') {
      useSoundStore.getState().seekTo(0);
      this.beginSession(item);
      return;
    }

    useQueueStore.getState().goToNext();
  }

  private beginSession(item: QueueItem): void {
    this.session = { itemId: item.id, started: true };
    eventBus.emit('trackStarted', item.track);
  }
}

export const playbackManager = new PlaybackManager();
