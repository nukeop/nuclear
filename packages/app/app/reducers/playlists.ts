import { Track } from '@nuclear/core';

import { Playlists } from '../actions/actionTypes';

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
}

export class PlaylistsStore {
  playlists: Playlist[] = []
}

const defaultState = { ...new PlaylistsStore() };

export default function PlaylistsReducer(state = defaultState, action) {
  switch (action.type) {
  case Playlists.LOAD_PLAYLISTS:
  case Playlists.ADD_PLAYLIST:
  case Playlists.DELETE_PLAYLIST:
  case Playlists.UPDATE_PLAYLIST:
    return {
      ...state,
      playlists: action.payload.playlists
    };
  default:
    return state;
  }
}
