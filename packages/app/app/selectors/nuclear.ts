import { ConfigFlag, ParamKey } from '@nuclear/core/src/rest/Nuclear/Configuration';
import { RootState } from '../reducers';
import { createStateSelectors } from './helpers';

export const nuclearSelectors = createStateSelectors('nuclear', ['identity', 'configuration']);

export const isConfigFlagEnabled = (flag: ConfigFlag) => (state: RootState) => {
  const configuration = nuclearSelectors.configuration(state).configuration;
  return configuration.isReady && !configuration.error && configuration.data[flag];
};

export const paramValue = (param: ParamKey) => (state: RootState) => {
  const params = nuclearSelectors.configuration(state).params;
  return params.isReady && !params.error && params.data[param];
};
