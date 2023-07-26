import { createStateSelectors } from './helpers';

export const playerSelectors = createStateSelectors(
  'player',
  [
    'playbackProgress',
    'playbackStatus',
    'playbackStreamLoading',
    'seek',
    'volume',
    'muted',
    'playbackRate'
  ]
);
