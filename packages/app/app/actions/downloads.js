import _ from 'lodash';
import { store } from '@nuclear/core';

import { safeAddUuid } from './helpers';

export const READ_DOWNLOADS = 'READ_DOWNLOADS';
export const ADD_TO_DOWNLOADS = 'ADD_TO_DOWNLOADS';
export const DOWNLOAD_STARTED = 'DOWNLOAD_STARTED';
export const DOWNLOAD_PAUSED = 'DOWNLOAD_PAUSED';
export const DOWNLOAD_RESUMED = 'DOWNLOAD_RESUMED';
export const DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS';
export const DOWNLOAD_FINISHED = 'DOWNLOAD_FINISHED';
export const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
export const CLEAR_FINISHED_DOWNLOADS = 'CLEAR_FINISHED_DOWNLOADS';

const changePropertyForItem = ({downloads, uuid, propertyName='status', value}) => {
  let changedItem = _.find(downloads, (item) => item.track.uuid === uuid);
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
  const clonedTrack = safeAddUuid(track);
  let downloads = store.get('downloads');
  const existingTrack = downloads.find(({track}) => {
    const {name, artist} = track;
    return artist.name === clonedTrack.artist.name && name === clonedTrack.name;
  });
  if (!existingTrack ){
    const newDownload = {
      status: 'Waiting',
      completion: 0,
      track: clonedTrack
    };
  
    downloads = _.concat(downloads, newDownload);
  }

  return {
    type: ADD_TO_DOWNLOADS,
    payload: { downloads, track: track.uuid }
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
    value: 'Paused'
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
    value: 'Waiting'
  });

  return {
    type: DOWNLOAD_RESUMED,
    payload: { downloads: payload, track: uuid }
  };
}

export function onDownloadProgress(uuid, progress) {
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    propertyName: 'completion',
    value: progress
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
    value: 'Error'
  });

  return {
    type: DOWNLOAD_ERROR,
    payload
  };
}

export function onDownloadFinished(uuid) {
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    value: 'Finished'
  });

  return {
    type: DOWNLOAD_FINISHED,
    payload
  };
}

export function clearFinishedDownloads() {
  const downloads = store.get('downloads');
  
  const filteredTracks = downloads.filter(( item ) => 
    item.status !== 'Finished' && item.status !== 'Error'
  );

  return {
    type: CLEAR_FINISHED_DOWNLOADS,
    payload: filteredTracks
  };
}
