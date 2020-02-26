import {
  ADD_TO_DOWNLOADS,
  DOWNLOAD_STARTED,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_FINISHED,
  DOWNLOAD_ERROR,
  CLEAR_FINISHED_DOWNLOADS,
  READ_DOWNLOADS
} from '../actions/downloads';

const initialState = [];


export default function DownloadsReducer(state=initialState, action) {
  switch (action.type) {
  case ADD_TO_DOWNLOADS:
  case READ_DOWNLOADS:
  case DOWNLOAD_STARTED:
  case DOWNLOAD_PROGRESS:
  case DOWNLOAD_FINISHED:
  case DOWNLOAD_ERROR:
  case CLEAR_FINISHED_DOWNLOADS:
    return [...action.payload];
  default:
    return state;
  }
}
