import { ActionType, getType } from 'typesafe-actions';
import * as ConnectivityActions from '../actions/connectivity';

type ConnectivityReducerActions = ActionType<typeof ConnectivityActions>

const ConnectivityReducer = (state = navigator.onLine, action: ConnectivityReducerActions): boolean => {
  switch (action.type) {
  case getType(ConnectivityActions.changeConnectivity):
    return action.payload;
  default:
    return state;
  }
};

export default ConnectivityReducer;
