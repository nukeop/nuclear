import { remote } from 'electron';
import _ from 'lodash';

import { initDb } from '../../server/libraryStore';
import { refreshLocalFolders } from '../mpris';

export const UPDATE_LOCAL_FOLDERS = 'UPDATE_LOCAL_FOLDERS';
export const SCAN_LOCAL_FOLDER = 'SCAN_LOCAL_FOLDERS';
export const SCAN_LOCAL_FOLDER_PROGRESS = 'SCAN_LOCAL_FOLDER_PROGRESS';
export const SCAN_LOCAL_FOLDER_SUCCESS = 'SCAN_LOCAL_FOLDER_SUCCESS';
export const SCAN_LOCAL_FOLDER_FAILED = 'SCAN_LOCAL_FOLDER_FAILED';
export const OPEN_LOCAL_FOLDER_PICKER = 'OPEN_LOCAL_FOLDER_PICKER';
export const UPDATE_LOCAL_FILTER = 'UPDATE_LOCAL_FILTER';
export const UPDATE_LOCAL_SORT = 'UPDATE_LOCAL_SORT';
export const UPDATE_LIBRARY_LIST_TYPE = 'UPDATE_LIBRARY_LIST_TYPE';

function updateLocalFolders(folders) {
  return {
    type: UPDATE_LOCAL_FOLDERS,
    payload: { folders }
  }
}

export function addLocalFolders(folders) {
  return async (dispatch, getState) => {
    const stateFolders = getState().folders || [];
    const newFolders = [...stateFolders, ...folders];
    const db = await initDb();
    await db.set('localFolders', newFolders).write();
    dispatch(updateLocalFolders(newFolders));
  }
}

export function removeLocalFolder(folder) {
  return async (dispatch, getState) => {
    const folders = _.filter(getState().folders, f => f !== folder);
    const db = await initDb();
    await db.set('localFolders', folders).write();
    dispatch(updateLocalFolders(folders));
  }
}

export function scanLocalFolders() {
  refreshLocalFolders();

  return {
    type: SCAN_LOCAL_FOLDER
  };
}

export function scanLocalFoldersProgress(scanProgress, scanTotal) {
  return {
    type: SCAN_LOCAL_FOLDER_PROGRESS,
    payload: {
      scanProgress,
      scanTotal
    }
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
    payload: { filter: event.target.value }
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

export function updateLibraryListType(listType) {
  return {
    type: UPDATE_LIBRARY_LIST_TYPE,
    payload: { listType }
  };
}
