import { RootState } from '../reducers';
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

export const playerStateSelector = (s:RootState) => s.player;
