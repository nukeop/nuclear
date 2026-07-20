import type { StreamCandidate, Track } from '@nuclearplayer/model';

import { isStreamExpired, streamingHost } from '../streamingHost';

export class CandidateSource {
  async forTrack(track: Track): Promise<StreamCandidate[] | undefined> {
    const cached = track.streamCandidates;
    if (cached?.length && !cached.some(isStreamExpired)) {
      return cached;
    }

    const result = await streamingHost.resolveCandidatesForTrack(track);
    if (result.success) {
      return result.candidates;
    }
    return undefined;
  }
}
