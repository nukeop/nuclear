import { Playlist } from '@nuclear/core';
import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { Playlists } from '../actions/actionTypes';
import * as actions from '../actions/playlists';
import { handleLoadableActionSuccess, handleLoadableActionError, startingStateMeta, handleLoadableActionStart } from './helpers';
import { Loadable } from './types';

export class PlaylistsStore {
  localPlaylists: Loadable<Playlist[]> = {...startingStateMeta};
  remotePlaylists: Loadable<Playlist[]> = {...startingStateMeta};
}

const defaultState = { ...new PlaylistsStore() };

export type PlaylistsAction = ActionType<typeof actions>;

const localPlaylistsKeyCreator = () => 'localPlaylists';
export const reducer = createReducer<PlaylistsStore, PlaylistsAction>(
  defaultState,
  {
    [Playlists.LOAD_LOCAL_PLAYLISTS_START]: handleLoadableActionStart(localPlaylistsKeyCreator),
    [Playlists.LOAD_LOCAL_PLAYLISTS_SUCCESS]: handleLoadableActionSuccess(localPlaylistsKeyCreator),
    [Playlists.LOAD_LOCAL_PLAYLISTS_ERROR]: handleLoadableActionError(localPlaylistsKeyCreator),
    [Playlists.UPDATE_LOCAL_PLAYLISTS]: (state, action) => produce(state, draft => {
      draft.localPlaylists = {
        ...state.localPlaylists,
        data: action.payload
      };
    })
  }
);
