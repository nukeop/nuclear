import { remote } from 'electron';
import _ from 'lodash';

import { mpris } from '@nuclear/core';

export const UPDATE_LOCAL_FOLDERS = 'UPDATE_LOCAL_FOLDERS';
export const SCAN_LOCAL_FOLDER = 'SCAN_LOCAL_FOLDERS';
export const SCAN_LOCAL_FOLDER_PROGRESS = 'SCAN_LOCAL_FOLDER_PROGRESS';
export const SCAN_LOCAL_FOLDER_SUCCESS = 'SCAN_LOCAL_FOLDER_SUCCESS';
export const SCAN_LOCAL_FOLDER_FAILED = 'SCAN_LOCAL_FOLDER_FAILED';
export const OPEN_LOCAL_FOLDER_PICKER = 'OPEN_LOCAL_FOLDER_PICKER';
export const UPDATE_LOCAL_FILTER = 'UPDATE_LOCAL_FILTER';
export const UPDATE_LOCAL_SORT = 'UPDATE_LOCAL_SORT';
export const UPDATE_LIBRARY_LIST_TYPE = 'UPDATE_LIBRARY_LIST_TYPE';
export const UPDATE_EXPANDED_FOLDERS = 'UPDATE_EXPANDED_FOLDERS';

function updateLocalFolders(folders) {
  return {
    type: UPDATE_LOCAL_FOLDERS,
    payload: { folders }
  };
}

function removeChildPath(folders) {
  return folders.filter(folder => {
    return folders.reduce((acc, file) => {
      return (acc && folder === file) || (acc && !folder.startsWith(file));
    }, true);
  });
}

export function addLocalFolders(folders, send = true) {
  return (dispatch, getState) => {
    const stateFolders = getState().local.folders || [];

    const newFolders = removeChildPath([
      ...stateFolders,
      ...folders
    ]);
    send && mpris.setLocalFolders(newFolders);
    dispatch(updateLocalFolders(newFolders));
  };
}

export function removeLocalFolder(folder) {
  return (dispatch, getState) => {
    const folders = _.filter(getState().local.folders, f => f !== folder);
    mpris.sendRemoveLocalFolder(folder);
    dispatch(updateLocalFolders(folders));
  };
}

export function scanLocalFolders() {
  mpris.refreshLocalFolders();

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
        // normalize path-seps (gets normalized on save to disk, but must happen from start for some UI code)
        folders = folders.map(path => path.replace(/\\/g, '/'));
        
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

export function updateExpandedFolders(expandedFolders) {
  return {
    type: UPDATE_EXPANDED_FOLDERS,
    payload: { expandedFolders }
  };
}
