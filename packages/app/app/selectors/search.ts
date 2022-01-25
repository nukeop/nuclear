import { createStateSelectors } from './helpers';

export const searchSelectors = createStateSelectors(
  'search',
  [
    'albumDetails',
    'artistDetails', 
    'searchHistory',
    'unifiedSearchStarted',
    'isFocused'
  ]
);
