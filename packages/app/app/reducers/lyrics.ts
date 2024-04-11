import * as LyricsActions from '../actions/lyrics';
import { ActionType, getType } from 'typesafe-actions';

type LyricsState = {
  lyricsSearchStarted: boolean
  lyricsSearchResult: string
}

const initialState: LyricsState = {
  lyricsSearchStarted: false,
  lyricsSearchResult: ''
};

type LyricsActions = ActionType<typeof LyricsActions>

export default function LyricsReducer (state = initialState, action) {

  switch (action.type) {
  case getType(LyricsActions.lyricsSearchStart):
    return Object.assign({}, state, {
      playbackStreamLoading: action.payload
    });
  case getType(LyricsActions.lyricsSearchSuccess):
    return Object.assign({}, state, {
      lyricsSearchResult: action.payload
    });
  default:
    return state;
  }
}
