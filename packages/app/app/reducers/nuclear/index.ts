import { combineReducers } from 'redux';

import { reducer as identity } from './identity';
import { reducer as configuration } from './configuration';

export const reducer = combineReducers({
  identity,
  configuration
});
