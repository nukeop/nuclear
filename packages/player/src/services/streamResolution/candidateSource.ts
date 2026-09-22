import { without } from 'lodash-es';

import type { StreamCandidate, Track } from '@nuclearplayer/model';

import {
  isSuccessCacheEntry,
  streamVerificationApi,
} from '../../apis/streamVerificationApi';
import { getSetting } from '../../stores/settingsStore';
import { Logger } from '../logger';
import { providersHost } from '../providersHost';
import { isStreamExpired, streamingHost } from '../streamingHost';

export const candidatesForTrack = async (
  track: Track,
): Promise<StreamCandidate[] | undefined> => {
  const cached = track.streamCandidates;
  if (cached?.length && !cached.some(isStreamExpired)) {
    return cached;
  }

  const [result, verifiedStreamId] = await Promise.all([
    streamingHost.resolveCandidatesForTrack(track),
    getVerifiedStreamId(track),
  ]);

  if (!result.success) {
    return undefined;
  }

  if (!verifiedStreamId) {
    return result.candidates;
  }

  const verified = result.candidates.find(
    (candidate) => candidate.id === verifiedStreamId,
  ) ?? {
    id: verifiedStreamId,
    title: track.title,
    failed: false,
    source: {
      provider: providersHost.getActive('streaming')!,
      id: verifiedStreamId,
    },
  };

  return [verified, ...without(result.candidates, verified)];
};

const getVerifiedStreamId = async (track: Track): Promise<string | false> => {
  if (!getSetting('core.playback.streamVerification')) {
    return false;
  }

  try {
    const topStream = await streamVerificationApi.getTopStream(track);
    return isSuccessCacheEntry(topStream) && topStream.value.streamId;
  } catch (error) {
    Logger.http.error(`Failed to get top stream: ${String(error)}`);
    return false;
  }
};
