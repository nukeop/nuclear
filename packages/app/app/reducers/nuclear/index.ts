import { combineReducers } from 'redux';

import { reducer as identity } from './identity';

export const reducer = combineReducers({
  identity
});
