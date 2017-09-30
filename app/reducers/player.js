import Sound from 'react-sound';

import {
  START_PLAYBACK,
  PAUSE_PLAYBACK,
  UPDATE_PLAYBACK_PROGRESS,
  UPDATE_SEEK
} from '../actions/player';

import {
  NEXT_SONG,
  PREVIOUS_SONG,
  SELECT_SONG
} from '../actions/queue';

const initialState = {
  playbackStatus: Sound.status.PAUSED,
  playbackProgress: 0,
  seek: 0
};

export default function PlayerReducer(state=initialState, action) {
  switch(action.type) {
    case START_PLAYBACK:
      return Object.assign({}, state, {
        playbackStatus: Sound.status.PLAYING
      });
    case PAUSE_PLAYBACK:
      return Object.assign({}, state, {
        playbackStatus: Sound.status.PAUSED
      });
    case UPDATE_PLAYBACK_PROGRESS:
      return Object.assign({}, state, {
        playbackProgress: action.payload.progress,
        seek: action.payload.seek
      });
    case UPDATE_SEEK:
      return Object.assign({}, state, {
        seek: action.payload
      });
    case NEXT_SONG:
    case PREVIOUS_SONG:
    case SELECT_SONG:
      console.log('derp');
      return Object.assign({}, state, {
        playbackProgress: 0,
        seek: 0
      });
    default:
      return state;
  }
}
