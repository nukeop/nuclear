import { getOption } from '@nuclear/core';
import Sound from 'react-hifi';
import { ActionType, getType } from 'typesafe-actions';
import * as PlayerActions from '../actions/player';
import {
  nextSongAction,
  previousSongAction,
  selectSong
} from '../actions/queue';

export type PlaybackStatus = 'PAUSED' | 'PLAYING' | 'STOPPED'

type PlayerReducerState = {
  playbackStatus: PlaybackStatus
  playbackStreamLoading: boolean
  playbackProgress: number
  seek: number
  volume: number
  muted: boolean
  playbackRate: number
}

const initialState: () => PlayerReducerState = () => {
  return ({
    playbackStatus: Sound.status.PAUSED,
    playbackStreamLoading: false,
    playbackProgress: 0,
    seek: 0,
    volume: getOption('volume') as number,
    muted: false,
    playbackRate: 2
  });
};

const actions = { nextSongAction, previousSongAction, selectSong, ...PlayerActions };

type PlayerReducerActions = ActionType<typeof actions>

export default function PlayerReducer(state=initialState(), action: PlayerReducerActions): PlayerReducerState {
  switch (action.type) {
  case getType(PlayerActions.startPlayback):
    return Object.assign({}, state, {
      playbackStatus: Sound.status.PLAYING
    });
  case getType(PlayerActions.pausePlayback):
    return Object.assign({}, state, {
      playbackStatus: Sound.status.PAUSED
    });
  case getType(PlayerActions.stopPlayback):
    return Object.assign({}, state, {
      playbackStatus: Sound.status.STOPPED
    });
  case getType(PlayerActions.updatePlaybackProgress):
    return Object.assign({}, state, {
      playbackProgress: action.payload.progress,
      seek: action.payload.seek
    });
  case getType(PlayerActions.updateSeek):
    return Object.assign({}, state, {
      seek: action.payload
    });
  case getType(PlayerActions.updateVolume):
    return Object.assign({}, state, {
      volume: action.payload
    });
  case getType(PlayerActions.mute):
    return Object.assign({}, state, {
      muted: true
    });
  case getType(PlayerActions.unMute):
    return Object.assign({}, state, {
      muted: false
    });
  case getType(nextSongAction):
  case getType(previousSongAction):
  case getType(selectSong):
    return Object.assign({}, state, {
      playbackProgress: 0,
      seek: 0
    });
  case getType(PlayerActions.updateStreamLoading):
    return Object.assign({}, state, {
      playbackStreamLoading: action.payload
    });
  case getType(PlayerActions.updatePlaybackRate):
    return Object.assign({}, state, {
      playbackRate: action.payload.rate
    });
  default:
    return state;
  }
}
