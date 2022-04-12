import {
  READ_FAVORITES,
  ADD_FAVORITE_TRACK,
  REMOVE_FAVORITE_TRACK,

  ADD_FAVORITE_ALBUM,
  REMOVE_FAVORITE_ALBUM,

  ADD_FAVORITE_ARTIST,
  REMOVE_FAVORITE_ARTIST,
  BULK_ADD_FAVORITE_TRACKS
} from '../actions/favorites';

const initialState = {
  tracks: [],
  artists: [],
  albums: []
};

const FavoritesReducer = (state = initialState, action) => {
  switch (action.type) {
  case READ_FAVORITES:
  case ADD_FAVORITE_TRACK:
  case REMOVE_FAVORITE_TRACK:
  case ADD_FAVORITE_ALBUM:
  case REMOVE_FAVORITE_ALBUM:
  case ADD_FAVORITE_ARTIST:
  case REMOVE_FAVORITE_ARTIST:
  case BULK_ADD_FAVORITE_TRACKS:
    return { ...action.payload };
  default:
    return state;
  }
};

export default FavoritesReducer;
