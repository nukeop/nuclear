export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';

export function addToQueue(item) {
  return (dispatch) => {
    dispatch({
      type: ADD_TO_QUEUE,
      payload: item
    });
  }
}
