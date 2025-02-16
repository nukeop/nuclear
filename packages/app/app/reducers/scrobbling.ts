import { Scrobbling } from '../actions/actionTypes';

export type ScrobblingState = {
  lastFmName: string | null;
  lastFmAuthToken: string | null;
  lastFmSessionKey: string | null;
  lastFmScrobblingEnabled: boolean;
};

const initialState: ScrobblingState = {
  lastFmName: null,
  lastFmAuthToken: null,
  lastFmSessionKey: null,
  lastFmScrobblingEnabled: false
};

export default function ScrobblingReducer(state=initialState, action): ScrobblingState {
  switch (action.type) {
  case Scrobbling.LASTFM_CONNECT:
    return Object.assign({}, state, {
      lastFmAuthToken: action.payload
    });
  case Scrobbling.LASTFM_LOGIN:
    return Object.assign({}, state, {
      lastFmName: action.payload.name,
      lastFmSessionKey: action.payload.sessionKey
    });
  case Scrobbling.LASTFM_LOGOUT:
    return Object.assign({}, state, {
      lastFmAuthToken: null,
      lastFmName: null,
      lastFmSessionKey: null
    });
  case Scrobbling.LASTFM_READ_SETTINGS:
    if (action.payload) {
      return Object.assign({}, state, {
        lastFmName: action.payload.lastFmName,
        lastFmAuthToken: action.payload.lastFmAuthToken,
        lastFmSessionKey: action.payload.lastFmSessionKey,
        lastFmScrobblingEnabled: action.payload.lastFmScrobblingEnabled
      });
    } else {
      return state;
    }
  case Scrobbling.LASTFM_ENABLE_SCROBBLING:
    return Object.assign({}, state, {
      lastFmScrobblingEnabled: true
    });
  case Scrobbling.LASTFM_DISABLE_SCROBBLING:
    return Object.assign({}, state, {
      lastFmScrobblingEnabled: false
    });
  default:
    return state;
  }
}
