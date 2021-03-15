import { createStateSelectors } from './helpers';

export const searchSelectors = createStateSelectors(
  'search',
  [
    'albumDetails'
  ]
);
