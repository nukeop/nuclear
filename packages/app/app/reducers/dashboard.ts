import { getType } from 'typesafe-actions';
import {loadBestNewAlbumsAction, loadBestNewTracksAction, loadTopTagsAction, loadTopTracksAction} from '../actions/dashboard';

const initialState = {
  bestNewAlbums: [],
  bestNewTracks: [],
  topTracks: []
};

export default function DashboardReducer(state = initialState, action) {
  switch (action.type) {
  case getType(loadBestNewAlbumsAction.success):
    return Object.assign({}, state, {
      bestNewAlbums: action.payload
    });
  case getType(loadBestNewTracksAction.success):
    return Object.assign({}, state, {
      bestNewTracks: action.payload
    });
  case getType(loadTopTagsAction.success):
    return Object.assign({}, state, {
      topTags: action.payload
    });
  case getType(loadTopTracksAction.success):
    return Object.assign({}, state, {
      topTracks: action.payload
    });
  default:
    return state;
  }
}
