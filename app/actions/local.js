import { remote } from 'electron';

import { refreshLocalFolders } from '../mpris';

export const ADD_LOCAL_FOLDERS = 'ADD_LOCAL_FOLDER';
export const REMOVE_LOCAL_FOLDER = 'REMOVE_LOCAL_FOLDER';
export const SCAN_LOCAL_FOLDER = 'SCAN_LOCAL_FOLDERS';
export const SCAN_LOCAL_FOLDER_SUCCESS = 'SCAN_LOCAL_FOLDER_SUCCESS';
export const SCAN_LOCAL_FOLDER_FAILED = 'SCAN_LOCAL_FOLDER_FAILED';
export const OPEN_LOCAL_FOLDER_PICKER = 'OPEN_LOCAL_FOLDER_PICKER';
export const UPDATE_LOCAL_FILTER = 'UPDATE_LOCAL_FILTER';
export const UPDATE_LOCAL_SORT = 'UPDATE_LOCAL_SORT';

export function addLocalFolders(payload) {
  return {
    type: ADD_LOCAL_FOLDERS,
    payload
  };
}

export function removeLocalFolder(payload) {
  return {
    type: REMOVE_LOCAL_FOLDER,
    payload
  };
}

export function scanLocalFolders() {
  refreshLocalFolders();

  return {
    type: SCAN_LOCAL_FOLDER
  };
}

export function scanLocalFoldersSuccess(payload) {
  return {
    type: SCAN_LOCAL_FOLDER_SUCCESS,
    payload
  };
}

export function scanLocalFoldersFailed(payload) {
  return {
    type: SCAN_LOCAL_FOLDER_FAILED,
    payload
  };
}

export function openLocalFolderPicker() {
  return dispatch => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }, folders => {
      if (folders) {
        dispatch(addLocalFolders(folders));
      }
    });
  };
}

export function updateFilter(event) {
  return {
    type: UPDATE_LOCAL_FILTER,
    payload: event.target.value
  };
}

export function updateLocalSort(sortBy, column, direction) {
  return {
    type: UPDATE_LOCAL_SORT,
    payload: {
      sortBy,
      direction: column !== sortBy
        ? 'ascending'
        : direction === 'ascending' ? 'descending' : 'ascending'
    }
  };
}
