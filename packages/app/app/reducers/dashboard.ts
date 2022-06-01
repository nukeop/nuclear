import { DeezerTopTrack } from '@nuclear/core/src/rest/Deezer';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';
import { ActionType, getType } from 'typesafe-actions';
import {loadBestNewAlbumsAction, loadBestNewTracksAction, loadTopTagsAction, loadTopTracksAction, PitchforkAlbum, PitchforkTrack} from '../actions/dashboard';

type DashboardReducerState = {
  bestNewAlbums: PitchforkAlbum[]
  bestNewTracks: PitchforkTrack[]
  topTracks: DeezerTopTrack[]
  topTags: LastfmTopTag[]
}

const initialState: DashboardReducerState = {
  bestNewAlbums: [],
  bestNewTracks: [],
  topTracks: [],
  topTags: []
};

const dashboardActions = {
  loadBestNewAlbumsAction,
  loadBestNewTracksAction,
  loadTopTagsAction,
  loadTopTracksAction
};

type DashboardReducerActions = ActionType<typeof dashboardActions>

export default function DashboardReducer(state = initialState, action: DashboardReducerActions): DashboardReducerState {
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

