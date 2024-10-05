import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { DeezerEditorialCharts, DeezerTrack } from '@nuclear/core/src/rest/Deezer';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';

import {loadEditorialChartsAction, loadEditorialPlaylistAction, loadTopTagsAction, loadTopTracksAction, loadPromotedArtistsAction} from '../actions/dashboard';
import { Dashboard } from '../actions/actionTypes';
import { handleLoadableActionError, handleLoadableActionStart, handleLoadableActionSuccess, handleLoadableEmptyActionStart, startingStateMeta } from './helpers';
import { Loadable } from './types';
import { PlaylistTrack } from '@nuclear/core';
import { PromotedArtist } from '@nuclear/core/src/rest/Nuclear/Promotion';

export type InternalTopTrack = Pick<DeezerTrack, 'id' | 'title' | 'duration' | 'album' | 'position'> & {
  artists: string[];
  thumbnail: string;
};

export type DashboardReducerState = {
  topTracks: InternalTopTrack[];
  topTags: LastfmTopTag[];

  editorialCharts: Loadable<DeezerEditorialCharts>;
  editorialPlaylists: {
    [id: string]: Loadable<{
      id: number;
      tracklist: PlaylistTrack[];
    }>;
  };

  promotedArtists: Loadable<PromotedArtist[]>;
}

const initialState: DashboardReducerState = {
  topTracks: [],
  topTags: [],
  editorialCharts: {...startingStateMeta},
  editorialPlaylists: {},
  promotedArtists: {...startingStateMeta}
};

const dashboardActions = {
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
  [Dashboard.LOAD_PROMOTED_ARTISTS_SUCCESS]: handleLoadableActionSuccess(promotedArtistsKeyCreator),
  [Dashboard.LOAD_PROMOTED_ARTISTS_ERROR]: handleLoadableActionError(promotedArtistsKeyCreator)

});

export default DashboardReducer;
