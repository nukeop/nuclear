import { combineReducers } from 'redux';

import { reducer as identity } from './identity';

const NuclearReducer = combineReducers({
  identity
});

export default NuclearReducer;
