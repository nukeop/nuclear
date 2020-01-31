
import {
  FAV_IMPORT_INIT,
  LASTFM_FAV_IMPORT_START,
  LASTFM_FAV_IMPORT_SUCCESS_1,
  LASTFM_FAV_IMPORT_SUCCESS_FINAL,
  LASTFM_FAV_IMPORT_ERROR
} from '../actions/importfavs';
  
const initialState = { 
  lastFmFavImportMessage: null,  
  lastFmFavImportStatus: true
};

export default function ImportFavsReducer(state=initialState, action) {
  switch (action.type) {
  case FAV_IMPORT_INIT:
    return Object.assign({}, state, {
      lastFmFavImportStatus: action.payload.lastFmFavImportStatus,
      lastFmFavImportMessage: action.payload.lastFmFavImportMessage
    });
  case LASTFM_FAV_IMPORT_START:
    return Object.assign({}, state, {
      lastFmFavImportStatus: false,
      lastFmFavImportMessage: 'Searching for favorites...'
    });
  case LASTFM_FAV_IMPORT_SUCCESS_1:
    return Object.assign({}, state, {
      lastFmFavImportMessage: 'Found ' + action.payload.lastFmFavImportCount + ' importing...'
    });
  case LASTFM_FAV_IMPORT_SUCCESS_FINAL:
    return Object.assign({}, state, {
      lastFmFavImportStatus: true,
      lastFmFavImportMessage: 'Done! Imported ' + action.payload.lastFmFavImportTotal + '/' + 
            action.payload.lastFmFavImportTotal
    });
  case LASTFM_FAV_IMPORT_ERROR:
    return Object.assign({}, state, {
      lastFmFavImportStatus: true,
      lastFmFavImportMessage: 'Error occured, failed to import favorites.'
    });
  default:
    return state;
  }
}
