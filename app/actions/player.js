import Sound from 'react-sound';
import { sendPaused, sendPlay } from '../mpris';

export const START_PLAYBACK = 'START_PLAYBACK';
export const PAUSE_PLAYBACK = 'PAUSE_PLAYBACK';
export const UPDATE_PLAYBACK_PROGRESS = 'UPDATE_PLAYBACK_PROGRESS';
export const UPDATE_SEEK = 'UPDATE_SEEK';
export const UPDATE_VOLUME = 'UPDATE_VOLUME';
export const UPDATE_PLAYBACK_STREAM_LOADING = 'UPDATE_PLAYBACK_STREAM_LOADING';

export function startPlayback() {
  sendPlay();
  return {
    type: START_PLAYBACK,
    payload: null
  };
}

export function pausePlayback() {
  sendPaused();
  return {
    type: PAUSE_PLAYBACK,
    payload: null
  };
}

export function togglePlayback(currentState) {
  return dispatch => {
    if (currentState === Sound.status.PLAYING) {
      dispatch(pausePlayback());
    } else {
      dispatch(startPlayback());
    }
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

export function updateStreamLoading(state) {
  return {
    type: UPDATE_PLAYBACK_STREAM_LOADING,
    payload: state
  };
}
