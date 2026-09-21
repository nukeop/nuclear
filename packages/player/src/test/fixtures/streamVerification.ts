import type { QueueItem } from '@nuclearplayer/model';

import { createMockCandidate } from '../builders/StreamingProviderBuilder';
import { createQueueItem } from './queue';

export const TRACK_WITH_CANDIDATES: QueueItem = {
  ...createQueueItem('Karma Police'),
  track: {
    ...createQueueItem('Karma Police').track,
    streamCandidates: [
      createMockCandidate('yt-a', 'Version A'),
      createMockCandidate('yt-b', 'Version B'),
    ],
  },
};
