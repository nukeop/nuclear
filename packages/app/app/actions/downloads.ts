import _ from 'lodash';
import { isEqual } from 'lodash';
import { store, StreamProvider } from '@nuclear/core';
import { getTrackItem } from '@nuclear/ui';
import { rewriteTrackArtists, safeAddUuid } from './helpers';
import { Download, DownloadStatus, Track, TrackItem } from '@nuclear/ui/lib/types';
import { createStandardAction } from 'typesafe-actions';
import { Download as DownloadActionTypes }  from './actionTypes';


type ChangePropertyForItemParams = {
  downloads: Download[]
  uuid: string
  propertyName?: 'completion' | 'status'
  value: number | DownloadStatus
}


const changePropertyForItem = ({downloads, uuid, propertyName='status', value}:ChangePropertyForItemParams): Download[] => {
  const changedItem = _.find(downloads, (item) => item.track.uuid === uuid);
  _.set(changedItem, propertyName, value);

  return downloads;
};

export const readDownloads = createStandardAction(DownloadActionTypes.READ_DOWNLOADS).map(
  () => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
    return  { payload: downloads };
  } 
);

export const addToDownloads = createStandardAction(DownloadActionTypes.ADD_TO_DOWNLOADS).map(
  (_:StreamProvider[], track: Track) => {
    const clonedTrack: TrackItem = safeAddUuid(getTrackItem(track));
    let downloads: Download[] = getDownloadsBackwardsCompatible();
  
    const existingTrack = downloads.find(({track}) => {
      const {name, artists} = track;
      return isEqual(artists, clonedTrack.artists) && name === clonedTrack.name;
    });
  
    if (!existingTrack ){
      const newDownload = {
        status: DownloadStatus.WAITING,
        completion: 0,
        track: clonedTrack
      };
    
      downloads = [...downloads, newDownload];

      return {
        payload: { downloads, track: clonedTrack.uuid }
      };
    }
    return {
      payload: { downloads }
    };
  }
);

export const onDownloadStarted = createStandardAction(DownloadActionTypes.DOWNLOAD_STARTED).map(
  (uuid: string) => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
    const payload = changePropertyForItem({
      downloads,
      uuid,
      value: DownloadStatus.STARTED
    });
    return {
      payload
    };
  }); 

export const onDownloadPause =  createStandardAction(DownloadActionTypes.DOWNLOAD_PAUSED).map(
  (uuid: string) => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
    const payload = changePropertyForItem({
      downloads,
      uuid,
      value: DownloadStatus.PAUSED
    });
    return {
      payload: { downloads: payload, track: uuid }
    };
  });

export const onDownloadResume = createStandardAction(DownloadActionTypes.DOWNLOAD_RESUMED).map(
  (uuid: string) => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
    const payload = changePropertyForItem({
      downloads,
      uuid,
      value: DownloadStatus.WAITING
    });
  
    return {
      payload: { downloads: payload, track: uuid }
    };
  });


export const onDownloadProgress = createStandardAction(DownloadActionTypes.DOWNLOAD_PROGRESS).map(
  (uuid: string, progress: number) => {
    const downloads = getDownloadsBackwardsCompatible();
    let payload = changePropertyForItem({
      downloads,
      uuid,
      propertyName: 'completion',
      value: progress
    });
  
    payload = changePropertyForItem({
      downloads: payload,
      uuid,
      value: progress < 1 ? DownloadStatus.STARTED : DownloadStatus.FINISHED
    });
  
    return {
      payload
    };
  });

export const onDownloadError = createStandardAction(DownloadActionTypes.DOWNLOAD_ERROR).map(
  (uuid: string) => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
    const payload = changePropertyForItem({
      downloads,
      uuid,
      value: DownloadStatus.ERROR
    });
  
    return {
      payload
    };
  });


export const onDownloadRemoved = createStandardAction(DownloadActionTypes.DOWNLOAD_REMOVED).map(
  (uuid: string) => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
    const filteredTracks = downloads.filter(item => item.track.uuid !== uuid);
    return {
      payload: filteredTracks
    };
  });

export const onDownloadFinished = createStandardAction(DownloadActionTypes.DOWNLOAD_FINISHED).map(
  (uuid: string) => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
    const payload = changePropertyForItem({
      downloads,
      uuid,
      value: DownloadStatus.FINISHED
    });

    return {
      payload
    };
  });

export const clearFinishedDownloads = createStandardAction(DownloadActionTypes.CLEAR_FINISHED_DOWNLOADS).map(
  () => {
    const downloads: Download[] = getDownloadsBackwardsCompatible();
  
    const filteredTracks = downloads.filter(( item ) => 
      item.status !== DownloadStatus.FINISHED && item.status !== DownloadStatus.ERROR
    );

    return {
      payload: filteredTracks
    };
  });

/**
* Helper function to read the old track format into the new format.
*
* `Track.artist` and `Track.extraArtists` are written into {@link Track.artists}
*/
function getDownloadsBackwardsCompatible(): Download[] {
  const downloads: Download[] = store.get('downloads');
  return downloads.map(download => {
    download.track = rewriteTrackArtists(download.track);
    return download;
  });
}
