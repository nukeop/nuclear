import {
  LASTFM_CONNECT,
  LASTFM_LOGIN,
  LASTFM_LOGOUT,
  LASTFM_READ_SETTINGS,
  LASTFM_ENABLE_SCROBBLING,
  LASTFM_DISABLE_SCROBBLING
} from '../actions/scrobbling';

const initialState = {
  lastFmName: null,
  lastFmAuthToken: null,
  lastFmSessionKey: null,
  lastFmScrobblingEnabled: false
};

export default function ScrobblingReducer(state=initialState, action) {
  switch (action.type) {
  case LASTFM_CONNECT:
    return Object.assign({}, state, {
      lastFmAuthToken: action.payload
    });
  case LASTFM_LOGIN:
    return Object.assign({}, state, {
      lastFmName: action.payload.name,
      lastFmSessionKey: action.payload.sessionKey
    });
  case LASTFM_LOGOUT:
    return Object.assign({}, state, {
      lastFmAuthToken: null,
      lastFmName: null,
      lastFmSessionKey: null
    });
  case LASTFM_READ_SETTINGS:
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
  case LASTFM_ENABLE_SCROBBLING:
    return Object.assign({}, state, {
      lastFmScrobblingEnabled: true
    });
  case LASTFM_DISABLE_SCROBBLING:
    return Object.assign({}, state, {
      lastFmScrobblingEnabled: false
    });
  default:
    return state;
  }
}
