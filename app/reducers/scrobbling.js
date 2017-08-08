import {
  LASTFM_CONNECT
} from '../actions/scrobbling';

const initialState = {
  lastFmName: null,
  lastFmSessionKey: null
};

export default function ScrobblingReducer(state=initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}
