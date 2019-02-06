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

export function notify(title, details, icon) {
  return dispatch => {
    let id = uuidv4();
    dispatch(addNotification({
      onClick: () => {
        dispatch(removeNotification(id));
      },
      id,
      title,
      details,
      icon
    }));
  };

}

export function error(title, details, icon) {
  return dispatch => {
    let id = uuidv4();
    dispatch(addNotification({
      onClick: () => {
        dispatch(removeNotification(id));
      },
      error: true,
      id,
      title,
      details,
      icon
    }));
  };
}
