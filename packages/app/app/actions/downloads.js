import _ from 'lodash';
import {ipcRenderer} from 'electron';

import { safeAddUuid } from './helpers';
import { store, getOption } from '../persistence/store';

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

const sendIPC = (uuid, actionType, downloads) => {
  const {track} =_.find(downloads, (item) => item.track.uuid === uuid);
  let maxDownloads;
  try {
    maxDownloads=parseInt(getOption('max.downloads'));
  } catch (err){
    maxDownloads=1;
  }
  switch (actionType){
  case ADD_TO_DOWNLOADS:
  case DOWNLOAD_RESUMED:{
    if (downloads.filter(({status}) => status==='Started' || status==='Waiting').length>maxDownloads) {
      return;
    }
    return ipcRenderer.send('start-download', track);
  }
  case DOWNLOAD_PAUSED:
    ipcRenderer.send('pause-download', track);
    // eslint-disable-next-line no-fallthrough
  case DOWNLOAD_FINISHED:
  case DOWNLOAD_ERROR:{
    const nextDownload = downloads.find((download) =>
      download.status==='Waiting'
    );
    return nextDownload?ipcRenderer.send('start-download', nextDownload.track):null;
  }
  }
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
  sendIPC(track.uuid, ADD_TO_DOWNLOADS, downloads);
  return {
    type: ADD_TO_DOWNLOADS,
    payload: downloads
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
  sendIPC(uuid, DOWNLOAD_PAUSED, downloads);
  return {
    type: DOWNLOAD_PAUSED,
    payload
  };
}

export function onDownloadResume(uuid) {
  const downloads = store.get('downloads');
  const payload = changePropertyForItem({
    downloads,
    uuid,
    value: 'Waiting'
  });
  sendIPC(uuid, DOWNLOAD_RESUMED, downloads);
  return {
    type: DOWNLOAD_RESUMED,
    payload
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
  sendIPC(uuid, DOWNLOAD_ERROR, downloads);
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
  sendIPC(uuid, DOWNLOAD_FINISHED, downloads);
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
