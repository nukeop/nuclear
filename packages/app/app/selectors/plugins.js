import { createStateSelectors } from './helpers';

export const pluginsSelectors = createStateSelectors(
  'plugin',
  [
    'plugins',
    'selected',
    'userPlugins'
  ]
);
