import { Download } from '@nuclear/ui/lib/types';
import * as DownloadActions from '../actions/downloads';
import { ActionType, getType } from 'typesafe-actions';

type DownloadReducerActions = ActionType<typeof DownloadActions>

type DownloadState = Download[]

const initialState: DownloadState = [];


export default function DownloadsReducer(state=initialState, action: DownloadReducerActions):DownloadState {
  switch (action.type) {
  case getType(DownloadActions.addToDownloads):
  case getType(DownloadActions.onDownloadResume):
  case getType(DownloadActions.onDownloadPause):
    return [...action.payload.downloads];
  case getType(DownloadActions.resumeDownloads):
  case getType(DownloadActions.readDownloads):
  case getType(DownloadActions.onDownloadStarted):
  case getType(DownloadActions.onDownloadProgress):
  case getType(DownloadActions.onDownloadFinished):
  case getType(DownloadActions.onDownloadError):
  case getType(DownloadActions.onDownloadRemoved):
  case getType(DownloadActions.clearFinishedDownloads):
    return [...action.payload];
  default:
    return state;
  }
}
