import { ipcRenderer } from 'electron';

import { PAUSE_PLAYBACK, START_PLAYBACK, UPDATE_VOLUME } from '../../actions/player';
import { SCAN_LOCAL_FOLDER, REMOVE_LOCAL_FOLDER, UPDATE_LOCAL_FOLDERS } from '../../actions/local';
import { ADD_QUEUE_ITEM, CLEAR_QUEUE, REMOVE_QUEUE_ITEM } from '../../actions/queue';
import { SET_BOOLEAN_OPTION } from '../../actions/settings';

const ipcConnect = ({ getState }) => next => ({ meta = {}, payload, type }) => {
  if (meta.fromMain) {
    next({ type, payload });
    return;
  }

  switch (type) {
  case START_PLAYBACK:
    ipcRenderer.send('play');
    break;
  case UPDATE_VOLUME:
    ipcRenderer.send('volume', payload);
    break;
  case PAUSE_PLAYBACK:
    ipcRenderer.send('paused');
    break;
  
  case SCAN_LOCAL_FOLDER:
    ipcRenderer.send('refresh-localfolders');
    break;
  case REMOVE_LOCAL_FOLDER:
    ipcRenderer.send('remove-localfolder', payload);
    break;
  case UPDATE_LOCAL_FOLDERS:
    ipcRenderer.send('set-localfolders', payload.folders);
    break;

  case ADD_QUEUE_ITEM:
    ipcRenderer.send('addTrack', payload.item);
    break;
  case CLEAR_QUEUE:
    ipcRenderer.send('clear-tracklist');
    break;
  case REMOVE_QUEUE_ITEM: {
    const { queue } = getState();

    if (queue.queueItems.length === 1) {
      ipcRenderer.send('removeTrack');
    } else {
      ipcRenderer.send('clear-tracklist');
    }

    break;
  }

  case SET_BOOLEAN_OPTION:
    switch (payload.option) {
    case 'shuffleQueue':
      ipcRenderer.send('shuffle', payload.state);
      break;
    case 'loopAfterQueueEnd':
      ipcRenderer.send('loopStatus', payload.state);
      break;
    }
  }

  next({ type, payload });
};

export default ipcConnect;
