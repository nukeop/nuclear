import { getOption, IpcEvents, isValidPort, logger } from '@nuclear/core';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { Middleware } from 'redux';
import { getType } from 'typesafe-actions';
import { LocalLibrary, Queue, Settings } from '../../actions/actionTypes';
import { changeConnectivity } from '../../actions/connectivity';
import * as DownloadActions from '../../actions/downloads';
import * as PlayerActions from '../../actions/player';
import { CLOSE_WINDOW, MAXIMIZE_WINDOW, MINIMIZE_WINDOW, OPEN_DEVTOOLS } from '../../actions/window';

type IpcActionType = {
  type: string;
  payload: any;
  meta: {
    fromMain?: boolean;
  };
}

const ipcConnect: Middleware = () => next => {
  next({
    type: LocalLibrary.UPDATE_LOCAL_FOLDERS,
    payload: ipcRenderer.sendSync(IpcEvents.LOCALFOLDERS_GET)
  });

  next({
    type: LocalLibrary.SCAN_LOCAL_FOLDERS_SUCCESS,
    payload: ipcRenderer.sendSync(IpcEvents.LOCAL_METAS)
  });

  return ({ meta = {}, payload, type }: IpcActionType) => {
    if (meta.fromMain) {
      next({ type, payload });
      return;
    }
  
    switch (type) {
    case getType(PlayerActions.startPlayback):
      ipcRenderer.send(IpcEvents.PLAY);
      break;
    case getType(PlayerActions.updateVolume):
      ipcRenderer.send(IpcEvents.VOLUME, payload);
      break;
    case getType(PlayerActions.pausePlayback):
      ipcRenderer.send(IpcEvents.PAUSE);
      break;
    case getType(PlayerActions.stopPlayback):
      ipcRenderer.send(IpcEvents.STOP);
      break;
    
    case LocalLibrary.SCAN_LOCAL_FOLDERS:
      ipcRenderer.send(IpcEvents.LOCALFOLDERS_REFRESH);
      break;
    case LocalLibrary.REMOVE_LOCAL_FOLDER:
      ipcRenderer.send(IpcEvents.LOCALFOLDER_REMOVE, payload);
      break;
    case LocalLibrary.UPDATE_LOCAL_FOLDERS:
      ipcRenderer.send(IpcEvents.LOCALFOLDERS_SET, payload);
      break;
  
    case Queue.ADD_QUEUE_ITEM:
      ipcRenderer.send(IpcEvents.TRACK_ADD, payload.item);
      break;
    case Queue.CLEAR_QUEUE:
      ipcRenderer.send(IpcEvents.QUEUE_CLEAR);
      break;
    case Queue.REMOVE_QUEUE_ITEM:
      ipcRenderer.send(IpcEvents.TRACK_REMOVE, payload);
      break;
    case Queue.QUEUE_DROP:
      return ipcRenderer.send(IpcEvents.QUEUE_DROP, payload);
  
    case Settings.SET_BOOLEAN_OPTION:
      switch (payload.option) {
      case 'api.enabled':
        ipcRenderer.send(payload.state ? IpcEvents.API_RESTART : IpcEvents.API_STOP);
        break;
      case 'shuffleQueue':
        ipcRenderer.send(IpcEvents.SHUFFLE, payload.state);
        break;
      case 'loopAfterQueueEnd':
        ipcRenderer.send(IpcEvents.LOOP, payload.state);
        break;
      case 'devtools':
        ipcRenderer.send(IpcEvents.WINDOW_OPEN_DEVTOOLS);
        break;
      }
      break;
    case Settings.SET_NUMBER_OPTION:
      if (payload.option === 'api.port' && isValidPort(payload.state) && getOption('api.enabled')) {
        ipcRenderer.send(IpcEvents.API_RESTART);
      }
      break;
      
    case getType(changeConnectivity):
      ipcRenderer.send(IpcEvents.CONNECTIVITY, payload);
      break;

    case getType(DownloadActions.addToDownloads):
    case getType(DownloadActions.onDownloadResume): {
      if (!payload.track) {
        break;
      }

      const {track} =_.find(payload.downloads, (item) => item.track.uuid === payload.track);
      
      let maxDownloads;
      try {
        maxDownloads = Number(getOption('max.downloads'));
      } catch (err){
        maxDownloads = 1;
      }
      if (payload.downloads.filter(({status}) => status === 'Started' || status === 'Waiting').length > maxDownloads) {
        break;
      }
      
      ipcRenderer.send(IpcEvents.DOWNLOAD_START, track);
      break;
    }
    case getType(DownloadActions.onDownloadPause): {
      const {track} =_.find(payload.downloads, (item) => item.track.uuid === payload.track);

      ipcRenderer.send(IpcEvents.DOWNLOAD_PAUSE, track);
      break;
    }
    case getType(DownloadActions.resumeDownloads):
    case getType(DownloadActions.onDownloadFinished):
    case getType(DownloadActions.onDownloadError): {
      const nextDownload = payload.find((download) =>
        download.status==='Waiting'
      );
      if (nextDownload) {
        ipcRenderer.send(IpcEvents.DOWNLOAD_START, nextDownload.track); 
      }
      break;
    }

    case CLOSE_WINDOW:
      return ipcRenderer.send(IpcEvents.WINDOW_CLOSE);
    case MAXIMIZE_WINDOW:
      return ipcRenderer.send(IpcEvents.WINDOW_MAXIMIZE);
    case MINIMIZE_WINDOW:
      return ipcRenderer.send(IpcEvents.WINDOW_MINIMIZE);
    case OPEN_DEVTOOLS:
      return ipcRenderer.send(IpcEvents.WINDOW_OPEN_DEVTOOLS);
    }
  
    next({ type, payload });
  };
};

export default ipcConnect;
