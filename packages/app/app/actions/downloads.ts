import _ from 'lodash';
import { store } from '@nuclear/core';
import { getTrackItem } from '@nuclear/ui';

import { safeAddUuid } from './helpers';

export const READ_DOWNLOADS = 'READ_DOWNLOADS';
export const ADD_TO_DOWNLOADS = 'ADD_TO_DOWNLOADS';
export const DOWNLOAD_STARTED = 'DOWNLOAD_STARTED';
export const DOWNLOAD_PAUSED = 'DOWNLOAD_PAUSED';
export const DOWNLOAD_RESUMED = 'DOWNLOAD_RESUMED';
export const DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS';
export const DOWNLOAD_FINISHED = 'DOWNLOAD_FINISHED';
export const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
export const DOWNLOAD_REMOVED = 'DOWNLOAD_REMOVED';
export const CLEAR_FINISHED_DOWNLOADS = 'CLEAR_FINISHED_DOWNLOADS';

export const DownloadStatus = {
  WAITING: 'Waiting',
  STARTED: 'Started',
  PAUSED: 'Paused',
  FINISHED: 'Finished',
  ERROR: 'Error'
};

const changePropertyForItem = ({downloads, uuid, propertyName='status', value}) => {
  const changedItem = _.find(downloads, (item) => item.track.uuid === uuid);
  _.set(changedItem, propertyName, value);

  return downloads;
};

export function readDownloads() {
  const downloads = store.get('downloads');
  return {
    type: READ_DOWNLOADS,
    payload: downloads
  };
}

export function addToDownloads(streamProviders, track) {
  const clonedTrack = safeAddUuid(getTrackItem(track));
  let downloads = store.get('downloads');

  const existingTrack = downloads.find(({track}) => {
    const {title, artist} = track;
    return artist.name === clonedTrack.artist && title === clonedTrack.title;
  });

  if (!existingTrack ){
    const newDownload = {
      status: DownloadStatus.WAITING,
      completion: 0,
      track: clonedTrack
    };
  
    downloads = [...downloads, newDownload];
  }

  return {
    type: ADD_TO_DOWNLOADS,
    payload: { downloads, track: clonedTrack.uuid }
  };
}

export function onDownloadStarted(uuid) {
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    value: 'Started'
  });
  return {
    type: DOWNLOAD_STARTED,
    payload
  };
}

export function onDownloadPause(uuid) {
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    value: DownloadStatus.PAUSED
  });
  return {
    type: DOWNLOAD_PAUSED,
    payload: { downloads: payload, track: uuid }
  };
}

export function onDownloadResume(uuid) {
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    value: DownloadStatus.WAITING
  });

  return {
    type: DOWNLOAD_RESUMED,
    payload: { downloads: payload, track: uuid }
  };
}

export function onDownloadProgress(uuid, progress) {
  const downloads = store.get('downloads');
  let payload = changePropertyForItem({
    downloads,
    uuid,
    propertyName: 'completion',
    value: progress
  });
  
  payload = changePropertyForItem({
    downloads: payload,
    uuid,
    value: DownloadStatus.STARTED
  });
  
  return {
    type: DOWNLOAD_PROGRESS,
    payload
  };
}

export function onDownloadError(uuid){
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    value: DownloadStatus.ERROR
  });

  return {
    type: DOWNLOAD_ERROR,
    payload
  };
}

export function onDownloadRemoved(uuid) {
  const downloads = store.get('downloads');
  const filteredTracks = downloads.filter(item => item.track.uuid !== uuid);
  return {
    type: DOWNLOAD_REMOVED,
    payload: filteredTracks
  };
}

export function onDownloadFinished(uuid) {
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    value: DownloadStatus.FINISHED
  });

  return {
    type: DOWNLOAD_FINISHED,
    payload
  };
}

export function clearFinishedDownloads() {
  const downloads = store.get('downloads');
  
  const filteredTracks = downloads.filter(( item ) => 
    item.status !== DownloadStatus.FINISHED && item.status !== DownloadStatus.ERROR
  );

  return {
    type: CLEAR_FINISHED_DOWNLOADS,
    payload: filteredTracks
  };
}
