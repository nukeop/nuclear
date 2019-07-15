import uuidv4 from 'uuid/v4';
import _ from 'lodash';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export function addNotification(notification) {
  return {
    type: ADD_NOTIFICATION,
    payload: notification
  };
}

export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    payload: id
  };
}

export function notify(title, details, icon, settings) {
  return generateNotification(title, details, icon, {}, settings);
}

export function error(title, details, icon, settings) {
  return generateNotification(title, details, icon, {error: true}, settings);
}

export function warning(title, details, icon, settings) {
  return generateNotification(title, details, icon, {warning: true}, settings);
}

export function success(title, details, icon, settings) {
  return generateNotification(title, details, icon, {success: true}, settings);
}

export function info(title, details, icon, settings) {
  return generateNotification(title, details, icon, {info: true}, settings);
}

function generateNotification(title, details, icon, type, settings) {
  return dispatch => {
    let id = uuidv4();
    dispatch(addNotification(Object.assign({}, {
      onClick: () => {
        dispatch(removeNotification(id));
      },
      id, title, details, icon
    },
    type)));

    const timeout = _.get(settings, 'notificationTimeout');
    setTimeout(() => dispatch(removeNotification(id)), timeout * 1000);
  };
}
