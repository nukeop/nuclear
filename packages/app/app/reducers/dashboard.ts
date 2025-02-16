import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { DeezerEditorialCharts, DeezerTrack } from '@nuclear/core/src/rest/Deezer';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';

import {loadEditorialChartsAction, loadEditorialPlaylistAction, loadTopTagsAction, loadTopTracksAction} from '../actions/dashboard';
import { Dashboard } from '../actions/actionTypes';
import { handleLoadableActionStart, handleLoadableActionSuccess, handleLoadableEmptyActionStart, startingStateMeta } from './helpers';
import { Loadable } from './types';
import { PlaylistTrack } from '@nuclear/core';

export type InternalTopTrack = Pick<DeezerTrack, 'id' | 'title' | 'duration' | 'album' | 'position'> & {
  artist: string;
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
}

const initialState: DashboardReducerState = {
  topTracks: [],
  topTags: [],
  editorialCharts: {...startingStateMeta},
  editorialPlaylists: {}
};

const dashboardActions = {
  loadTopTagsAction,
  loadTopTracksAction,
  loadEditorialChartsAction,
  loadEditorialPlaylistAction
};

type DashboardReducerActions = ActionType<typeof dashboardActions>

const editorialChartsKeyCreator = () => 'editorialCharts';
export const editorialPlaylistKeyCreator = ({id}: {id: number}) => `editorialPlaylists.${id}`;

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
  [Dashboard.LOAD_EDITORIAL_PLAYLIST_SUCCESS]: handleLoadableActionSuccess(editorialPlaylistKeyCreator)
});

export default DashboardReducer;
