import Sound from 'react-hifi';
import { setOption } from '@nuclear/core';
import { createStandardAction } from 'typesafe-actions';
import { Player } from './actionTypes';
import { PlaybackStatus } from '../reducers/player';

export const startPlayback = createStandardAction(Player.START_PLAYBACK).map((fromMain: boolean) => {
  return {
    meta: { fromMain }
  };
});

export const pausePlayback = createStandardAction(Player.PAUSE_PLAYBACK).map((fromMain: boolean) => {
  return {
    meta: { fromMain }
  };
});

export function togglePlayback(currentState: PlaybackStatus, fromMain: boolean) {
  return dispatch => {
    if (currentState === Sound.status.PLAYING) {
      dispatch(pausePlayback(fromMain));
    } else {
      dispatch(startPlayback(fromMain));
    }
  };
}

export function resetPlayer() {
  return dispatch => {
    dispatch(updatePlaybackProgress(0, 0));
    dispatch(pausePlayback(false));
    dispatch(updateStreamLoading(false));
  };
}

export const updatePlaybackProgress = createStandardAction(Player.UPDATE_PLAYBACK_PROGRESS).map((progress: number, seek: number) => {
  return {
    payload: {
      progress,
      seek
    }
  };
});

export const updateSeek = createStandardAction(Player.UPDATE_SEEK)<number>();

export const updateVolume = createStandardAction(Player.UPDATE_VOLUME).map((volume: number, fromMain: boolean) => {
  setOption('volume', volume);
  return {
    payload: volume,
    meta: { fromMain }
  };
});

export const mute = createStandardAction(Player.MUTE)();

export const unMute = createStandardAction(Player.UNMUTE)();

export function toggleMute(muted: boolean) {
  return dispatch => {
    if (muted){
      dispatch(mute());
    } else {
      dispatch(unMute());
    }
  };
}

export const updateStreamLoading = createStandardAction(Player.UPDATE_PLAYBACK_STREAM_LOADING)<boolean>();
