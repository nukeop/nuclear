function getArtistAndTrack(songTitle) {
  var tokens = songTitle.split('-');
  return {
    artist: tokens[0].trim(),
    track: tokens[1].trim()
  };
}

module.exports = {
  getArtistAndTrack: getArtistAndTrack
}
