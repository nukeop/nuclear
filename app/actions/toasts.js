import uuidv4 from 'uuid/v4';

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

export function notify(title, details, icon, timeout=3) {
  return generateNotification(title, details, icon, {}, timeout);
}

export function error(title, details, icon, timeout=3) {
  return generateNotification(title, details, icon, {error: true}, timeout);
}

export function warning(title, details, icon, timeout=3) {
  return generateNotification(title, details, icon, {warning: true}, timeout);
}

export function success(title, details, icon, timeout=3) {
  return generateNotification(title, details, icon, {success: true}, timeout);
}

export function info(title, details, icon, timeout=3) {
  return generateNotification(title, details, icon, {info: true}, timeout);
}

function generateNotification(title, details, icon, type, timeout=3) {
  return dispatch => {
    let id = uuidv4();
    dispatch(addNotification(Object.assign({}, {
      onClick: () => {
        dispatch(removeNotification(id));
      },
      id, title, details, icon
    },
    type)));

    setTimeout(() => dispatch(removeNotification(id)), timeout * 1000);
  };
}
