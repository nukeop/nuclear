import { combineReducers } from 'redux';

import SearchReducer from './search';

const rootReducer = combineReducers({
  search: SearchReducer
});

export default rootReducer;
