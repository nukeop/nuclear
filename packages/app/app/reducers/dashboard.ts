import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { DeezerEditorialCharts, mapDeezerTrackToInternal } from '@nuclear/core/src/rest/Deezer';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';

import {loadBestNewAlbumsAction, loadBestNewTracksAction, loadEditorialChartsAction, loadEditorialPlaylistAction, loadTopTagsAction, loadTopTracksAction, PitchforkAlbum, PitchforkTrack, loadPromotedArtistsAction} from '../actions/dashboard';
import { Dashboard } from '../actions/actionTypes';
import { handleLoadableActionStart, handleLoadableActionSuccess, handleLoadableEmptyActionStart, startingStateMeta } from './helpers';
import { Loadable } from './types';
import { PlaylistTrack } from '@nuclear/core';

export type DashboardReducerState = {
  bestNewAlbums: PitchforkAlbum[];
  bestNewTracks: PitchforkTrack[];
  topTracks: ReturnType<typeof mapDeezerTrackToInternal>[];
  topTags: LastfmTopTag[];

  editorialCharts?: Loadable<DeezerEditorialCharts>;
  editorialPlaylists?: {
    [id: string]: Loadable<{
      id: number;
      tracklist: PlaylistTrack[];
    }>;
  };

  promotedArtists?: Loadable<string[]>;
}

const initialState: DashboardReducerState = {
  bestNewAlbums: [],
  bestNewTracks: [],
  topTracks: [],
  topTags: [],
  editorialCharts: {...startingStateMeta},
  editorialPlaylists: {}
};

const dashboardActions = {
  loadBestNewAlbumsAction,
  loadBestNewTracksAction,
  loadTopTagsAction,
  loadTopTracksAction,
  loadEditorialChartsAction,
  loadEditorialPlaylistAction,
  loadPromotedArtistsAction
};

type DashboardReducerActions = ActionType<typeof dashboardActions>

const editorialChartsKeyCreator = () => 'editorialCharts';
export const editorialPlaylistKeyCreator = ({id}: {id: number}) => `editorialPlaylists.${id}`;
const promotedArtistsKeyCreator = () => 'promotedArtists';

const DashboardReducer = createReducer<DashboardReducerState, DashboardReducerActions>(initialState, {
  [Dashboard.LOAD_BEST_NEW_ALBUMS_SUCCESS]: (state, action) => produce(state, draft => {
    draft.bestNewAlbums = action.payload;
  }),
  [Dashboard.LOAD_BEST_NEW_TRACKS_SUCCESS]: (state, action) => produce(state, draft => {
    draft.bestNewTracks = action.payload;
  }),
  [Dashboard.LOAD_TOP_TRACKS_SUCCESS]: (state, action) => produce(state, draft => {
    draft.topTracks = action.payload;
  }),
  [Dashboard.LOAD_TOP_TAGS_SUCCESS]: (state, action) => produce(state, draft => {
    draft.topTags = action.payload;
  }),
  
  [Dashboard.LOAD_EDITORIAL_CHARTS_START]: handleLoadableEmptyActionStart(editorialChartsKeyCreator),
  [Dashboard.LOAD_EDITORIAL_CHARTS_SUCCESS]: handleLoadableActionSuccess(editorialChartsKeyCreator),

  [Dashboard.LOAD_EDITORIAL_PLAYLIST_START]: handleLoadableActionStart(editorialPlaylistKeyCreator),
  [Dashboard.LOAD_EDITORIAL_PLAYLIST_SUCCESS]: handleLoadableActionSuccess(editorialPlaylistKeyCreator),

  [Dashboard.LOAD_PROMOTED_ARTISTS_START]: handleLoadableEmptyActionStart(promotedArtistsKeyCreator),
  [Dashboard.LOAD_PROMOTED_ARTISTS_SUCCESS]: handleLoadableActionSuccess(promotedArtistsKeyCreator)

});

export default DashboardReducer;
