import {
  LASTFM_CONNECT,
  LASTFM_LOGIN
} from '../actions/scrobbling';

const initialState = {
  lastFmName: null,
  lastFmAuthToken: null,
  lastFmSessionKey: null
};

export default function ScrobblingReducer(state=initialState, action) {
  switch(action.type) {
    case LASTFM_CONNECT:
      return Object.assign({}, state, {
        lastFmAuthToken: action.payload
      });
    case LASTFM_LOGIN:
      return Object.assign({}, state, {
        lastFmName: action.payload.name,
        lastFmSessionKey: action.payload.sessionKey
      });
    default:
      return state;
  }
}
