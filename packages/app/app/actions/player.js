import Sound from 'react-hifi';
import { mpris } from '@nuclear/core';

export const START_PLAYBACK = 'START_PLAYBACK';
export const PAUSE_PLAYBACK = 'PAUSE_PLAYBACK';
export const UPDATE_PLAYBACK_PROGRESS = 'UPDATE_PLAYBACK_PROGRESS';
export const UPDATE_SEEK = 'UPDATE_SEEK';
export const UPDATE_VOLUME = 'UPDATE_VOLUME';
export const MUTE = 'MUTE';
export const UNMUTE = 'UNMUTE';
export const UPDATE_PLAYBACK_STREAM_LOADING = 'UPDATE_PLAYBACK_STREAM_LOADING';

export function startPlayback() {
  mpris.sendPlay();
  return {
    type: START_PLAYBACK,
    payload: null
  };
}

export function pausePlayback(sendPaused) {
  sendPaused();
  return {
    type: PAUSE_PLAYBACK,
    payload: null
  };
}

export function togglePlayback(currentState, sendPaused) {
  return dispatch => {
    if (currentState === Sound.status.PLAYING) {
      dispatch(pausePlayback(sendPaused));
    } else {
      dispatch(startPlayback());
    }
  };
}

export function resetPlayer(sendPaused) {
  return dispatch => {
    dispatch(updatePlaybackProgress(0, 0));
    dispatch(pausePlayback(sendPaused));
    dispatch(updateStreamLoading(false));
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
  mpris.sendVolume(volume);
  return {
    type: UPDATE_VOLUME,
    payload: volume
  };
}

export function mute(){
  return {
    type: MUTE,
    payload: null
  };
}

export function unMute(){
  return {
    type: UNMUTE,
    payload: null
  };
}

export function toggleMute(muted) {
  return dispatch => {
    if (muted){
      dispatch(mute());
    } else {
      dispatch(unMute());
    }
  };
}

export function updateStreamLoading(state) {
  return {
    type: UPDATE_PLAYBACK_STREAM_LOADING,
    payload: state
  };
}
