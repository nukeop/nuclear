import Sound from 'react-sound';

export const START_PLAYBACK = 'START_PLAYBACK';
export const PAUSE_PLAYBACK = 'PAUSE_PLAYBACK';
export const UPDATE_PLAYBACK_PROGRESS = 'UPDATE_PLAYBACK_PROGRESS';

export function togglePlayback(currentState) {
  return dispatch => {
    if (currentState == Sound.status.PLAYING) {
      dispatch(pausePlayback());
    } else {
      dispatch(startPlayback());
    }
  };
}

export function startPlayback() {
  return {
    type: START_PLAYBACK,
    payload: null
   }
}

export function pausePlayback() {
  return {
    type: PAUSE_PLAYBACK,
    payload: null
   }
}

export function updatePlaybackProgress(progress) {
  return {
    type: UPDATE_PLAYBACK_PROGRESS,
    payload: progress
  }
}
