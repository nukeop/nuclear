import {
  LASTFM_CONNECT,
  LASTFM_LOGIN,
  LASTFM_LOGOUT,
  LASTFM_READ_SETTINGS,
  LASTFM_ENABLE_SCROBBLING,
  LASTFM_DISABLE_SCROBBLING,
  LASTFM_ENABLE_IMPORT,
  LASTFM_DISABLE_IMPORT
} from '../actions/scrobbling';

const initialState = {
  lastFmName: null,
  lastFmAuthToken: null,
  lastFmSessionKey: null,
  lastFmScrobblingEnabled: false,
  lastFmFavImportStatus: false
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
      lastFmSessionKey: action.payload.sessionKey,
      lastFmFavImportStatus: action.payload.lastFmFavImportStatus
    });
  case LASTFM_LOGOUT:
    return Object.assign({}, state, {
      lastFmAuthToken: null,
      lastFmName: null,
      lastFmSessionKey: null,
      lastFmFavImportStatus: false
    });
  case LASTFM_READ_SETTINGS:
    if (action.payload) {
      return Object.assign({}, state, {
        lastFmName: action.payload.lastFmName,
        lastFmAuthToken: action.payload.lastFmAuthToken,
        lastFmSessionKey: action.payload.lastFmSessionKey,
        lastFmScrobblingEnabled: action.payload.lastFmScrobblingEnabled,
        lastFmFavImportStatus: action.payload.lastFmFavImportStatus
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
  case LASTFM_ENABLE_IMPORT:
    return Object.assign({}, state, {
      lastFmFavImportStatus: true
    });
  case LASTFM_DISABLE_IMPORT:
    return Object.assign({}, state, {
      lastFmFavImportStatus: false
    });
  default:
    return state;
  }
}
