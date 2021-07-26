import { createStateSelectors } from './helpers';

export const githubContribSelectors = createStateSelectors(
  'githubContrib',
  [
    'contributors',
    'loading',
    'error'
  ]
);
