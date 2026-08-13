import type { AudioSource } from '@nuclearplayer/hifi';
import type { QueueItem } from '@nuclearplayer/model';

type PlaybackSession = {
  itemId: string;
  started: boolean;
};

export type StartTrackOptions = {
  autoPlay: boolean;
};

export class PlaybackManager {
  private session: PlaybackSession | null = null;

  play(): void {}

  pause(): void {}

  toggle(): void {}

  startTrack(
    item: QueueItem,
    source: AudioSource,
    options: StartTrackOptions,
  ): void {}

  finishTrack(): void {}
}

export const playbackManager = new PlaybackManager();
