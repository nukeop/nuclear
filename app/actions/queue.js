var _ = require('lodash');
export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';

export function addToQueue(musicSources, item) {
  return (dispatch) => {
    Promise.all(_.map(musicSources, m => m.search(item.artist + ' ' + item.name)))
    .then(results => {
      item.streams = results;

      dispatch({
        type: ADD_TO_QUEUE,
        payload: item
      });
    });
  }
}
