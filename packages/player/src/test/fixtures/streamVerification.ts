import { createMockCandidate } from '../builders/StreamingProviderBuilder';
import { createQueueItem } from './queue';

export const TRACK_WITH_CANDIDATES = createQueueItem('Karma Police');

export const CANDIDATES = [
  createMockCandidate('yt-a', 'Version A'),
  createMockCandidate('yt-b', 'Version B'),
  createMockCandidate('yt-c', 'Version C'),
];
