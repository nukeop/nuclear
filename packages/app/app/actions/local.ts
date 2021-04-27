import { createAction } from 'redux-actions';
import { remote } from 'electron';
import { LIST_TYPE } from '@nuclear/ui/lib/components/LibraryListTypeToggle';

import { LocalLibrary } from './actionTypes';
import { VoidAction } from './helpers';
import { Track } from '@nuclear/core';

export enum LocalLibraryKeyNames {
  Pending = 'pending',
  Error = 'error',
  Folders = 'folders',
  Page = 'page',
  SortBy = 'sortBy',
  Direction = 'direction',
  Filter = 'filter',
  ListType = 'listType',
  Tracks = 'tracks',
  ExpandedFolders = 'expandedFolders',
  ScanProgress = 'scanProgress',
  ScanTotal = 'scanTotal'
}

export class LocalLibraryState {
  [LocalLibraryKeyNames.Pending] = false;
  [LocalLibraryKeyNames.Error] = false;
  [LocalLibraryKeyNames.Folders] = [];
  [LocalLibraryKeyNames.Page] = 0;
  [LocalLibraryKeyNames.SortBy] = 'artist';
  [LocalLibraryKeyNames.Direction] = 'ascending';
  [LocalLibraryKeyNames.Filter] = '';
  [LocalLibraryKeyNames.ListType] = LIST_TYPE.SIMPLE_LIST;
  [LocalLibraryKeyNames.Tracks] = [];
  [LocalLibraryKeyNames.ExpandedFolders] = [];
  [LocalLibraryKeyNames.ScanProgress] = 0;
  [LocalLibraryKeyNames.ScanTotal] = 0;
}

export const localLibraryActions = {
  updateLocalFolders: createAction(LocalLibrary.UPDATE_LOCAL_FOLDERS, (folders: string[]) => folders),
  removeLocalFolder: createAction(LocalLibrary.REMOVE_LOCAL_FOLDER, (folder: string[]) => folder),
  scanLocalFolders: VoidAction(LocalLibrary.SCAN_LOCAL_FOLDERS),
  scanLocalFoldersProgress: createAction(LocalLibrary.SCAN_LOCAL_FOLDERS_PROGRESS, (scanProgress: number, scanTotal: number) => ({ scanProgress, scanTotal })),
  scanLocalFoldersSuccess: createAction(LocalLibrary.SCAN_LOCAL_FOLDERS_SUCCESS, (payload: Track[]) => payload),
  scanLocalFoldersFailure: VoidAction(LocalLibrary.SCAN_LOCAL_FOLDERS_FAILURE),
  updateFilter: createAction(LocalLibrary.UPDATE_LOCAL_FILTER, (event: { target: { value: string }}) => ({ filter: event.target.value })),
  updateLocalSort: createAction(LocalLibrary.UPDATE_LOCAL_SORT, (sortBy, column, direction) => ({
    sortBy,
    direction: column !== sortBy
      ? 'ascending'
      : direction === 'ascending' ? 'descending' : 'ascending'
  })),
  updateLibraryListType: createAction(LocalLibrary.UPDATE_LIBRARY_LIST_TYPE, (listType) => ({ listType })),
  updateExpandedFolders: createAction(LocalLibrary.UPDATE_EXPANDED_FOLDERS, (expandedFolders) => ({ expandedFolders }))
};

function removeChildPath(folders) {
  return folders.filter(folder => {
    return folders.reduce((acc, file) => {
      return (acc && folder === file) || (acc && !folder.startsWith(file));
    }, true);
  });
}

export function addLocalFolders(folders) {
  return (dispatch, getState) => {
    const stateFolders = getState().local.folders || [];

    const newFolders = removeChildPath([
      ...stateFolders,
      ...folders
    ]);
    dispatch(localLibraryActions.updateLocalFolders(newFolders));
  };
}

export const openLocalFolderPicker = () => async dispatch => {
  let folders = await (await remote.dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ['openDirectory', 'multiSelections'] })).filePaths;
  if (folders) {
    // normalize path-seps (gets normalized on save to disk, but must happen from start for some UI code)
    folders = folders.map(path => path.replace(/\\/g, '/'));
    dispatch(addLocalFolders(folders));
  }
};

export const openLocalFilePicker = async () => {
  let filePaths = await (await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    filters: [
      {name: 'json', extensions: ['json']}
    ],
    properties: ['openFile']
  })).filePaths;
  if (filePaths) {
    filePaths = filePaths.map(path => path.replace(/\\/g, '/'));
    return filePaths;
  }
};
