import _ from 'lodash';

import {
  READ_FAVORITES,
  ADD_FAVORITE_TRACK
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
    return Object.assign({}, {
      tracks: _.concat(state.tracks, action.payload)
    });
  default:
    return state;
  }
}
