import type { StreamCandidate, Track } from '@nuclearplayer/model';

import { useSettingsStore } from '../../stores/settingsStore';
import { streamingHost } from '../streamingHost';

export class CandidateSource {
  async forTrack(track: Track): Promise<StreamCandidate[] | undefined> {
    const cached = track.streamCandidates;
    if (cached?.length && !this.haveGoneStale(cached)) {
      return cached;
    }

    const result = await streamingHost.resolveCandidatesForTrack(track);
    if (result.success) {
      return result.candidates;
    }
    return undefined;
  }

  private haveGoneStale(candidates: StreamCandidate[]): boolean {
    const expiryMs = useSettingsStore
      .getState()
      .getValue('playback.streamExpiryMs') as number;
    const now = Date.now();

    return candidates.some((candidate) => {
      if (!candidate.lastResolvedAtIso) {
        return false;
      }
      const resolvedAt = new Date(candidate.lastResolvedAtIso).getTime();
      return now - resolvedAt > expiryMs;
    });
  }
}
