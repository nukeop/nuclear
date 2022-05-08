import produce from 'immer';
import { handleActions } from 'redux-actions';

import { LocalLibrary } from '../actions/actionTypes';
import { ActionsType, PayloadType } from '../actions/helpers';
import { localLibraryActions, LocalLibraryState } from '../actions/local';
import { Track } from '@nuclear/core';
import { handleSpreadAction } from './helpers';

export type LocalLibraryActions = ActionsType<typeof localLibraryActions>
type LocalLibraryPayload = PayloadType<LocalLibraryActions>

const defaultState = { ...new LocalLibraryState() };

export const reducer = handleActions<LocalLibraryState, LocalLibraryPayload>({
  [LocalLibrary.UPDATE_LOCAL_FOLDERS]: (state, { payload }) =>
    produce(state, draft => {
      draft.folders = payload as string[];
    }),
  [LocalLibrary.REMOVE_LOCAL_FOLDER]: (state, { payload }) =>
    produce(state, draft => {
      draft.folders = draft.folders?.filter(folder => folder !== String(payload));
    }),
  [LocalLibrary.SCAN_LOCAL_FOLDERS]: (state) =>
    produce(state, draft => {
      draft.pending = true;
      draft.error = false;
    }),
  [LocalLibrary.SCAN_LOCAL_FOLDERS_PROGRESS]: (state, { payload }) =>
    produce(state, draft => {
      const { scanProgress, scanTotal } = payload as {
        scanProgress: number;
        scanTotal: number;
      };
      draft.scanProgress = scanProgress;
      draft.scanTotal = scanTotal;
    }),
  [LocalLibrary.SCAN_LOCAL_FOLDERS_SUCCESS]: (state, { payload }) =>
    produce(state, draft => {
      draft.pending = false;
      draft.scanProgress = null;
      draft.scanTotal = null;
      draft.tracks = payload as Track[];
    }),
  [LocalLibrary.SCAN_LOCAL_FOLDERS_FAILURE]: (state) =>
    produce(state, draft => {
      draft.pending = false;
      draft.scanProgress = null;
      draft.scanTotal = null;
      draft.error = true;
    }),
  [LocalLibrary.UPDATE_LOCAL_FILTER]: handleSpreadAction,
  [LocalLibrary.UPDATE_LOCAL_SORT]: handleSpreadAction,
  [LocalLibrary.UPDATE_LIBRARY_LIST_TYPE]: handleSpreadAction,
  [LocalLibrary.UPDATE_EXPANDED_FOLDERS]: handleSpreadAction
}, defaultState);
