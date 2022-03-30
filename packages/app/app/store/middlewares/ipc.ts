import { getOption, IpcEvents, isValidPort } from '@nuclear/core';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

import { PAUSE_PLAYBACK, START_PLAYBACK, UPDATE_VOLUME } from '../../actions/player';
import { LocalLibrary } from '../../actions/actionTypes';
import { ADD_QUEUE_ITEM, CLEAR_QUEUE, REMOVE_QUEUE_ITEM, QUEUE_DROP } from '../../actions/queue';
import { Settings } from '../../actions/actionTypes';
import { changeConnectivity } from '../../actions/connectivity';
import { ADD_TO_DOWNLOADS, DOWNLOAD_RESUMED, DOWNLOAD_PAUSED, DOWNLOAD_FINISHED, DOWNLOAD_ERROR } from '../../actions/downloads';
import { CLOSE_WINDOW, MINIMIZE_WINDOW, MAXIMIZE_WINDOW, OPEN_DEVTOOLS } from '../../actions/window';
import { getType } from 'typesafe-actions';
import { Middleware } from 'redux';

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
    case START_PLAYBACK:
      ipcRenderer.send(IpcEvents.PLAY);
      break;
    case UPDATE_VOLUME:
      ipcRenderer.send(IpcEvents.VOLUME, payload);
      break;
    case PAUSE_PLAYBACK:
      ipcRenderer.send(IpcEvents.PAUSE);
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
  
    case ADD_QUEUE_ITEM:
      ipcRenderer.send(IpcEvents.TRACK_ADD, payload.item);
      break;
    case CLEAR_QUEUE:
      ipcRenderer.send(IpcEvents.QUEUE_CLEAR);
      break;
    case REMOVE_QUEUE_ITEM:
      ipcRenderer.send(IpcEvents.TRACK_REMOVE, payload);
      break;
    case QUEUE_DROP:
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

    case ADD_TO_DOWNLOADS:
    case DOWNLOAD_RESUMED: {
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
    case DOWNLOAD_PAUSED: {
      const {track} =_.find(payload.downloads, (item) => item.track.uuid === payload.track);

      ipcRenderer.send(IpcEvents.DOWNLOAD_PAUSE, track);
      break;
    }
    case DOWNLOAD_FINISHED:
    case DOWNLOAD_ERROR: {
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
