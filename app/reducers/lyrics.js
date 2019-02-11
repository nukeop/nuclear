import {
  LYRIC_SEARCH_START,
  LYRIC_SEARCH_SUCCESS
} from '../actions/lyrics';

const initialState = {
  lyricsSearchStarted: false,
  lyricsSearchResults: []
};

export default function LyricsReducer (state = initialState, action) {

  switch (action.type) {
  case LYRIC_SEARCH_START:
    return Object.assign({}, state, {
      lyricsSearchStarted: action.payload
    });
  case LYRIC_SEARCH_SUCCESS:
    return Object.assign({}, state, {
      lyricsSearchResults: action.payload
    });
  default:
    return state;
  }
}
