import type { Stream, StreamCandidate, Track } from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type { StreamCandidate };

export type StreamingProvider = ProviderDescriptor<'streaming'> & {
  searchForTrack: (
    artist: string,
    title: string,
    album?: string,
  ) => Promise<StreamCandidate[]>;

  searchForTrackV2?: (track: Track) => Promise<StreamCandidate[]>;

  getStreamUrl: (candidateId: string) => Promise<Stream>;

  getStreamUrlV2?: (candidate: StreamCandidate) => Promise<Stream>;

  supportsLocalFiles?: boolean;
};

export type StreamResolutionResult =
  | { success: true; candidates: StreamCandidate[] }
  | { success: false; error: string };

export type StreamingHost = {
  resolveCandidatesForTrack: (track: Track) => Promise<StreamResolutionResult>;
  resolveStreamForCandidate: (
    candidate: StreamCandidate,
  ) => Promise<StreamCandidate | undefined>;
};
