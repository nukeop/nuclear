import _ from 'lodash';

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION
} from '../actions/toasts';

const initialState = {
  notifications: []
};

export default function ToastsReducer(state=initialState, action) {
  switch (action.type) {
  case ADD_NOTIFICATION:
    return Object.assign({}, state, {
      notifications: _.concat(state.notifications, action.payload)
    });
  case REMOVE_NOTIFICATION:
  default:
    return state;
  }
}
