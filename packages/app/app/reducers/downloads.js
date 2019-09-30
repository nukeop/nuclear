import _ from 'lodash';
import {
  ADD_TO_DOWNLOADS,
  DOWNLOAD_STARTED,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_FINISHED,
  DOWNLOAD_ERROR,
  CLEAR_FINISHED_DOWNLOADS
} from '../actions/downloads';

const initialState = {
  downloads: []
};

let newDownloads, changedItem;

const changePropertyForItem = (state, action, propertyName, value) => {
  newDownloads = _.cloneDeep(state.downloads);
  changedItem = _.find(newDownloads, item => item.track.uuid === action.payload.uuid);
  _.set(changedItem, propertyName, value);
  return Object.assign({}, state, {
    downloads: newDownloads
  });
};

export default function DownloadsReducer(state=initialState, action) {
  switch (action.type) {
  case ADD_TO_DOWNLOADS:
    return Object.assign({}, state, {
      downloads: _.concat(state.downloads, action.payload.item)
    });
  case DOWNLOAD_STARTED:
    return changePropertyForItem(
      state,
      action,
      'status',
      'Started'
    );
  case DOWNLOAD_PROGRESS:
    return changePropertyForItem(
      state,
      action,
      'completion',
      action.payload.progress
    );
  case DOWNLOAD_FINISHED:
    return changePropertyForItem(
      state,
      action,
      'status',
      'Finished'
    );
  case DOWNLOAD_ERROR:
    return changePropertyForItem(
      state,
      action,
      'status',
      'Error'
    );
  case CLEAR_FINISHED_DOWNLOADS:
    newDownloads = _.cloneDeep(state.downloads);
    newDownloads = _.filter(newDownloads, item => {
      return item.status !== 'Finished' && item.status !== 'Error';
    });
    return Object.assign({}, state, {
      downloads: newDownloads
    });
  default:
    return state;
  }
}
