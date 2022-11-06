import { createReducer } from 'typesafe-actions';
import { Configuration, Parameters } from '@nuclear/core/src/rest/Nuclear/Configuration';

import { handleLoadableActionError, handleLoadableActionStart, handleLoadableActionSuccess, startingStateMeta } from '../helpers';
import { Loadable } from '../types';
import { NuclearConfiguration } from '../../actions/actionTypes';

export class ConfigurationStore {
    configuration: Loadable<Configuration> = {...startingStateMeta};
    params: Loadable<Parameters> = {...startingStateMeta};
}

const defaultState = { ...new ConfigurationStore() };

const configurationKeyCreator = () => 'configuration';
const paramsKeyCreator = () => 'params';

export const reducer = createReducer<ConfigurationStore>(defaultState, {
  [NuclearConfiguration.FETCH_NUCLEAR_CONFIG_START]: handleLoadableActionStart(configurationKeyCreator),
  [NuclearConfiguration.FETCH_NUCLEAR_CONFIG_SUCCESS]: handleLoadableActionSuccess(configurationKeyCreator),
  [NuclearConfiguration.FETCH_NUCLEAR_CONFIG_ERROR]: handleLoadableActionError(configurationKeyCreator),
    
  [NuclearConfiguration.FETCH_NUCLEAR_PARAMS_START]: handleLoadableActionStart(paramsKeyCreator),
  [NuclearConfiguration.FETCH_NUCLEAR_PARAMS_SUCCESS]: handleLoadableActionSuccess(paramsKeyCreator),
  [NuclearConfiguration.FETCH_NUCLEAR_PARAMS_ERROR]: handleLoadableActionError(paramsKeyCreator)
});
