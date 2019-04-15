import _ from 'lodash';
import {
  ADD_TO_DOWNLOADS,
  DOWNLOAD_STARTED,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_FINISHED,
  DOWNLOAD_ERROR
} from '../actions/downloads';

const initialState = {
  downloads: []
};

let newDownloads, changedItem;

export default function DownloadsReducer(state=initialState, action) {
  switch (action.type) {
  case ADD_TO_DOWNLOADS:
    return Object.assign({}, state, {
      downloads: _.concat(state.downloads, action.payload.item)
    });
  case DOWNLOAD_STARTED:
    newDownloads = _.cloneDeep(state.downloads);
    changedItem = _.find(newDownloads, item => item.track.uuid === action.payload.uuid);
    _.set(changedItem, 'status', 'Started');
    return Object.assign({}, state, {
      downloads: newDownloads
    });
  case DOWNLOAD_PROGRESS:
    newDownloads = _.cloneDeep(state.downloads);
    changedItem = _.find(newDownloads, item => item.track.uuid === action.payload.uuid);
    _.set(changedItem, 'completion', action.payload.progress);
    return Object.assign({}, state, {
      downloads: newDownloads
    });
  case DOWNLOAD_FINISHED:
    newDownloads = _.cloneDeep(state.downloads);
    changedItem = _.find(newDownloads, item => item.track.uuid === action.payload.uuid);
    _.set(changedItem, 'status', 'Finished');
    return Object.assign({}, state, {
      downloads: newDownloads
    }); 
  default:
    return state;
  }
}
