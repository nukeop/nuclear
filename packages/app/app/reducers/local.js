import { LIST_TYPE } from '@nuclear/ui/lib/components/LibraryListTypeToggle';
import {
  SCAN_LOCAL_FOLDER,
  SCAN_LOCAL_FOLDER_FAILED,
  SCAN_LOCAL_FOLDER_PROGRESS,
  SCAN_LOCAL_FOLDER_SUCCESS,
  UPDATE_LOCAL_FILTER,
  UPDATE_LOCAL_SORT,
  UPDATE_LIBRARY_LIST_TYPE,
  UPDATE_LOCAL_FOLDERS,
  UPDATE_EXPANDED_FOLDERS
} from '../actions/local';
import { mpris } from '@nuclear/core';

export function local_getInitialState() {
  return {
    pending: false,
    error: false,
    folders: mpris.getLocalFolders(),
    page: 0,
    sortBy: 'artist',
    direction: 'ascending',
    filter: '',
    listType: LIST_TYPE.SIMPLE_LIST,
    tracks: mpris.getLocalMetas(),
    expandedFolders: []
  };
}
const initialState = local_getInitialState();

export default function LocalReducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_LOCAL_FOLDERS:
    return {
      ...state,
      folders: action.payload.folders
    };
  case SCAN_LOCAL_FOLDER:
    return {
      ...state,
      pending: true,
      error: false
    };
  case SCAN_LOCAL_FOLDER_PROGRESS:
    return {
      ...state,
      scanProgress: action.payload.scanProgress,
      scanTotal: action.payload.scanTotal
    };
  case SCAN_LOCAL_FOLDER_SUCCESS:
    return {
      ...state,
      pending: false,
      scanProgress: null,
      scanTotal: null,
      tracks: action.payload
    };
  case SCAN_LOCAL_FOLDER_FAILED:
    return {
      ...state,
      pending: false,
      scanProgress: null,
      scanTotal: null,
      error: true
    };
  case UPDATE_LOCAL_FILTER:
  case UPDATE_LOCAL_SORT:
  case UPDATE_LIBRARY_LIST_TYPE:
  case UPDATE_EXPANDED_FOLDERS:
    return {
      ...state,
      ...action.payload
    };
  default:
    return state;
  }
}
