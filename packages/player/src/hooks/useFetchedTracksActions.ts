import isEmpty from 'lodash-es/isEmpty';
import { useState } from 'react';

import type { Track } from '@nuclearplayer/model';

import type { LogScope } from '../services/logger';
import { playbackManager } from '../services/playback';
import { useQueueStore } from '../stores/queue/queueStore';
import { reportError } from '../utils/logging';

type FetchFailure = {
  scope: LogScope;
  message: string;
};

export const useFetchedTracksActions = (
  fetchTracks: () => Promise<Track[]>,
  failure: FetchFailure,
) => {
  const addToQueue = useQueueStore((state) => state.addToQueue);
  const [isLoading, setIsLoading] = useState(false);

  const withFetchedTracks =
    (handleTracks: (tracks: Track[]) => void) => async () => {
      setIsLoading(true);
      try {
        const tracks = await fetchTracks();
        if (isEmpty(tracks)) {
          return;
        }
        handleTracks(tracks);
      } catch (error) {
        await reportError(failure.scope, {
          userMessage: failure.message,
          error,
        });
      } finally {
        setIsLoading(false);
      }
    };

  return {
    play: withFetchedTracks(playbackManager.playTracks),
    enqueue: withFetchedTracks(addToQueue),
    isLoading,
  };
};
