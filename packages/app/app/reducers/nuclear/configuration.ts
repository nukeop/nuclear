import { createReducer } from 'typesafe-actions';

export class ConfigurationStore {

}

const defaultState = { ...new ConfigurationStore() };

export const reducer = createReducer<ConfigurationStore>(defaultState, {

});
