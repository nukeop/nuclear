import _ from 'lodash';
import {
  ADD_TO_DOWNLOADS
} from '../actions/downloads';

const initialState = {
  downloads: []
};

export default function DownloadsReducer(state=initialState, action) {
  switch (action.type) {
  case ADD_TO_DOWNLOADS:
    return Object.assign({}, state, {
      downloads: _.concat(state.downloads, action.payload.track)
    });
  default:
    return state;
  }
}
