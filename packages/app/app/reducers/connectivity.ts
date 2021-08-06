import { getType } from 'typesafe-actions';
import { changeConnectivity } from '../actions/connectivity';

function ConnectivityReducer(state = navigator.onLine, action) {
  switch (action.type) {
  case getType(changeConnectivity):
    return action.payload;
  default:
    return state;
  }
}

export default ConnectivityReducer;
