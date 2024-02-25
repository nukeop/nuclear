import {
  READ_BLACKLISTED,
  BLACKLIST_TRACK,
  REMOVE_BLACKLISTED_TRACK
} from '../actions/blacklist';
  
const initialState =  [];
  
const BlacklistReducer = (state = initialState, action) => {
  switch (action.type) {
  case READ_BLACKLISTED:
  case BLACKLIST_TRACK:
  case REMOVE_BLACKLISTED_TRACK:
    return [...action.payload];
  default:
    return state;
  }
};
  
export default BlacklistReducer;
