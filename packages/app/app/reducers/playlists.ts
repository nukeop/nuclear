import { Track } from '@nuclear/core';
import {
  ADD_PLAYLIST,
  LOAD_PLAYLISTS,
  DELETE_PLAYLIST,
  UPDATE_PLAYLIST
} from '../actions/playlists';

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
  case LOAD_PLAYLISTS:
  case ADD_PLAYLIST:
  case DELETE_PLAYLIST:
  case UPDATE_PLAYLIST:
    return {
      ...state,
      playlists: action.payload.playlists
    };
  default:
    return state;
  }
}
