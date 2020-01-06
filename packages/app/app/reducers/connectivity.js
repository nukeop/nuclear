import { CHANGE_CONNECTIVITY } from '../actions/connectivity';

function ConnectivityReducer(state = navigator.onLine, action) {
  switch (action.type) {
  case CHANGE_CONNECTIVITY:
    return action.payload;
  default:
    return state;
  }
}

export default ConnectivityReducer;
