import { without } from 'lodash-es';

import type { StreamCandidate, Track } from '@nuclearplayer/model';

import { providersHost } from '../providersHost';
import { isStreamExpired, streamingHost } from '../streamingHost';
import { streamVerification } from '../streamVerification';

export const candidatesForTrack = async (
  track: Track,
): Promise<StreamCandidate[] | undefined> => {
  const cached = track.streamCandidates;
  if (cached?.length && !cached.some(isStreamExpired)) {
    return cached;
  }

  const [result, verifiedStream] = await Promise.all([
    streamingHost.resolveCandidatesForTrack(track),
    streamVerification.getVerifiedStream(track),
  ]);

  if (!result.success) {
    return undefined;
  }

  if (!verifiedStream) {
    return result.candidates;
  }

  const verified = result.candidates.find(
    (candidate) => candidate.id === verifiedStream.streamId,
  ) ?? {
    id: verifiedStream.streamId,
    title: track.title,
    failed: false,
    source: {
      provider: providersHost.getActive('streaming')!,
      id: verifiedStream.streamId,
    },
  };

  return [verified, ...without(result.candidates, verified)];
};
