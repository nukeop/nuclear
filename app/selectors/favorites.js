export function getIsTrackFavorite(state, artist, title) {
  return state.favorites.tracks.find(track => track.artist.name === artist && track.name === title);
}
