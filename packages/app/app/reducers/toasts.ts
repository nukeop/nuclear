import { Notification } from '@nuclear/ui/lib/types';
import _ from 'lodash';
import { ActionType, getType } from 'typesafe-actions';
import * as ToastActions from '../actions/toasts';

type ToastsState = {
  notifications: Notification[]
}

const initialState: ToastsState = {
  notifications: []
};

type ToastReducerActions = ActionType<typeof ToastActions>

export default function ToastsReducer(state=initialState, action: ToastReducerActions):ToastsState {
  switch (action.type) {
  case getType(ToastActions.addNotification):
    return Object.assign({}, state, {
      notifications: _.concat(state.notifications, action.payload)
    });
  case getType(ToastActions.removeNotification):
    return Object.assign({}, state, {
      notifications: _.filter(state.notifications,  n => n.id !== action.payload)
    });
  default:
    return state;
  }
}
