
import { ImportFavs } from '../actions/actionTypes';
  
const initialState = { 
  lastFmFavImportMessage: null,  
  lastFmFavImportStatus: true
};

export default function ImportFavsReducer(state=initialState, action) {
  switch (action.type) {
  case ImportFavs.FAV_IMPORT_INIT:
    return Object.assign({}, state, {
      lastFmFavImportStatus: action.payload.lastFmFavImportStatus,
      lastFmFavImportMessage: action.payload.lastFmFavImportMessage
    });
  case ImportFavs.LASTFM_FAV_IMPORT_START:
    return Object.assign({}, state, {
      lastFmFavImportStatus: false,
      lastFmFavImportMessage: 'Searching for favorites...'
    });
  case ImportFavs.LASTFM_FAV_IMPORT_SUCCESS_1:
    return Object.assign({}, state, {
      lastFmFavImportMessage: 'Found ' + action.payload.lastFmFavImportCount + ' importing...'
    });
  case ImportFavs.LASTFM_FAV_IMPORT_SUCCESS_FINAL:
    return Object.assign({}, state, {
      lastFmFavImportStatus: true,
      lastFmFavImportMessage: 'Done! Imported ' + action.payload.lastFmFavImportTotal + '/' + 
            action.payload.lastFmFavImportTotal
    });
  case ImportFavs.LASTFM_FAV_IMPORT_ERROR:
    return Object.assign({}, state, {
      lastFmFavImportStatus: true,
      lastFmFavImportMessage: 'Error: ' + action.payload.lastFmFavImportErrorMsg
    });
  default:
    return state;
  }
}
