import isEmpty from 'lodash-es/isEmpty';

import type { Track } from '@nuclearplayer/model';

import type { LogScope } from '../services/logger';
import { reportError } from '../utils/logging';
import { useQueueActions } from './useQueueActions';

type FetchFailure = {
  scope: LogScope;
  message: string;
};

export const useFetchedTracksActions = (
  fetchTracks: () => Promise<Track[]>,
  failure: FetchFailure,
) => {
  const { addToQueue, playTracks } = useQueueActions();

  const withFetchedTracks =
    (handleTracks: (tracks: Track[]) => void) => async () => {
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
      }
    };

  return {
    play: withFetchedTracks(playTracks),
    enqueue: withFetchedTracks(addToQueue),
  };
};
