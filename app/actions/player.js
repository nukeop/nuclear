import Sound from 'react-sound';

export const START_PLAYBACK = 'START_PLAYBACK';
export const PAUSE_PLAYBACK = 'PAUSE_PLAYBACK';
export const UPDATE_PLAYBACK_PROGRESS = 'UPDATE_PLAYBACK_PROGRESS';
export const UPDATE_SEEK = 'UPDATE_SEEK';
export const UPDATE_VOLUME = 'UPDATE_VOLUME';

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
  };
}

export function pausePlayback() {
  return {
    type: PAUSE_PLAYBACK,
    payload: null
  };
}

export function updatePlaybackProgress(progress, seek) {
  return {
    type: UPDATE_PLAYBACK_PROGRESS,
    payload: {
      progress, 
      seek
    }
  };
}

export function updateSeek(seek) {
  return {
    type: UPDATE_SEEK,
    payload: seek
  };
}

export function updateVolume(volume) {
  return {
    type: UPDATE_VOLUME,
    payload: volume
  };
}
