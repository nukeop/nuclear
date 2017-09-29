import Sound from 'react-sound';

import {
  START_PLAYBACK,
  PAUSE_PLAYBACK,
  UPDATE_PLAYBACK_PROGRESS,
  UPDATE_SEEK
} from '../actions/player';

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
        playbackProgress: action.payload,
        seek: action.payload
      });
    case UPDATE_SEEK:
      return Object.assign({}, state, {
        seek: action.payload
      });
    default:
      return state;
  }
}
