import { safeAddUuid } from './helpers';

export const ADD_TO_DOWNLOADS = 'ADD_TO_DOWNLOADS';
export const DOWNLOAD_STARTED = 'DOWNLOAD_STARTED';
export const DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS';
export const DOWNLOAD_FINISHED = 'DOWNLOAD_FINISHED';
export const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
export const CLEAR_FINISHED_DOWNLOADS = 'CLEAR_FINISHED_DOWNLOADS';

export function addToDownloads(musicSources, track) {  
  return {
    type: ADD_TO_DOWNLOADS,
    payload: { item: {
      status: 'Waiting',
      completion: 0,
      track: safeAddUuid(track)
    } }
  };
}

export function onDownloadStarted(uuid) {
  return {
    type: DOWNLOAD_STARTED,
    payload: {
      uuid
    }
  };
}

export function onDownloadProgress(uuid, progress) {
  return {
    type: DOWNLOAD_PROGRESS,
    payload: {
      uuid,
      progress
    }
  };
}

export function onDownloadFinished(uuid) {
  return {
    type: DOWNLOAD_FINISHED,
    payload: {
      uuid
    }
  };
}

export function clearFinishedDownloads() {
  return {
    type: CLEAR_FINISHED_DOWNLOADS
  };
}
