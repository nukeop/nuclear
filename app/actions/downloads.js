export const ADD_TO_DOWNLOADS = 'ADD_TO_DOWNLOADS';

export function addToDownloads(track) {
  return {
    type: ADD_TO_DOWNLOADS,
    payload: { item: {
      status: 'Started',
      completion: 0,
      track
    } }
  };
}
