import {
  READ_FAVORITES,
  ADD_FAVORITE_TRACK,
  REMOVE_FAVORITE_TRACK,

  ADD_FAVORITE_ALBUM,
  REMOVE_FAVORITE_ALBUM
} from '../actions/favorites';

const initialState = {
  tracks: [],
  artists: [],
  albums: []
};

export default function FavoritesReducer(state=initialState, action) {
  switch (action.type) {
  case READ_FAVORITES:
    return Object.assign({}, action.payload);
  case ADD_FAVORITE_TRACK:
  case REMOVE_FAVORITE_TRACK:
  case ADD_FAVORITE_ALBUM:
  case REMOVE_FAVORITE_ALBUM:
    return Object.assign({}, action.payload);
  default:
    return state;
  }
}
