import type { StreamCandidate, Track } from '@nuclearplayer/model';
import type {
  StreamingHost,
  StreamingProvider,
} from '@nuclearplayer/plugin-sdk';

import { useSettingsStore } from '../stores/settingsStore';
import { resolveErrorMessage } from '../utils/logging';
import { Logger } from './logger';
import { providersHost } from './providersHost';

const getActiveStreamingProvider = (): StreamingProvider | undefined =>
  providersHost.get<StreamingProvider>(
    providersHost.getActive('streaming'),
    'streaming',
  );

const isStreamExpired = (candidate: StreamCandidate): boolean => {
  if (!candidate.lastResolvedAtIso || !candidate.stream) {
    return true;
  }

  const expiryMs = useSettingsStore
    .getState()
    .getValue('playback.streamExpiryMs') as number;
  const resolvedAt = new Date(candidate.lastResolvedAtIso).getTime();

  return Date.now() - resolvedAt > expiryMs;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs = 500,
): Promise<T> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      await sleep(baseDelayMs * 2 ** attempt);
    }
  }
  throw new Error('Unreachable');
};

export const createStreamingHost = (): StreamingHost => ({
  resolveCandidatesForTrack: async (track: Track) => {
    const provider = getActiveStreamingProvider();

    if (!provider) {
      Logger.streaming.warn('No streaming provider available');
      return {
        success: false,
        error: 'No streaming provider available',
      };
    }

    try {
      const artistName = track.artists[0]?.name ?? 'Unknown Artist';
      const albumName = track.album?.title;

      const candidates = await provider.searchForTrack(
        artistName,
        track.title,
        albumName,
      );

      return {
        success: true,
        candidates,
      };
    } catch (error) {
      Logger.streaming.error(
        `resolveCandidatesForTrack error: ${resolveErrorMessage(error)}`,
      );
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to resolve candidates: ${message}`,
      };
    }
  },

  resolveStreamForCandidate: async (candidate: StreamCandidate) => {
    const provider = getActiveStreamingProvider();

    if (!provider) {
      Logger.streaming.warn('No provider for stream resolution');
      return undefined;
    }

    if (candidate.failed) {
      Logger.streaming.warn('Candidate already marked as failed');
      return candidate;
    }

    if (candidate.stream && !isStreamExpired(candidate)) {
      return candidate;
    }

    const retries =
      (useSettingsStore
        .getState()
        .getValue('playback.streamResolutionRetries') as number) ?? 3;

    try {
      const stream = await withRetry(
        () => provider.getStreamUrl(candidate.id),
        retries,
      );

      return {
        ...candidate,
        stream,
        lastResolvedAtIso: new Date().toISOString(),
        failed: false,
      };
    } catch (error) {
      Logger.streaming.error(
        `getStreamUrl failed: ${resolveErrorMessage(error)}`,
      );
      return {
        ...candidate,
        failed: true,
        stream: undefined,
      };
    }
  },
});

export const streamingHost = createStreamingHost();
