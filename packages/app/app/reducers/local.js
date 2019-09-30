import {
  ADD_LOCAL_FOLDERS,
  REMOVE_LOCAL_FOLDER,
  SCAN_LOCAL_FOLDER,
  SCAN_LOCAL_FOLDER_FAILED,
  SCAN_LOCAL_FOLDER_SUCCESS,
  UPDATE_LOCAL_FILTER,
  UPDATE_LOCAL_SORT
} from '../actions/local';
import { store } from '../persistence/store';

const initialState = {
  pending: false,
  error: false,
  folders: store.get('localFolders'),
  page: 0,
  sortBy: 'artist',
  direction: 'ascending',
  filter: '',
  tracks: {}
};

export default function LocalReducer(state = initialState, action) {
  switch (action.type) {
  case ADD_LOCAL_FOLDERS: {
    const folders = [
      ...state.folders,
      ...action.payload
    ];

    store.set('localFolders', folders);

    return {
      ...state,
      folders
    };
  }
  case REMOVE_LOCAL_FOLDER: {
    const folders = state.folders.filter(folder => folder !== action.payload);

    store.set('localFolders', folders);

    return {
      ...state,
      folders
    };
  }
  case SCAN_LOCAL_FOLDER:
    return {
      ...state,
      pending: true,
      error: false
    };
  case SCAN_LOCAL_FOLDER_SUCCESS:
    return {
      ...state,
      pending: false,
      tracks: action.payload
    };
  case SCAN_LOCAL_FOLDER_FAILED:
    return {
      ...state,
      pending: false,
      error: true
    };
  case UPDATE_LOCAL_FILTER:
    return {
      ...state,
      filter: action.payload
    };
  case UPDATE_LOCAL_SORT:
    return {
      ...state,
      ...action.payload
    };
  default:
    return state;
  }
}
