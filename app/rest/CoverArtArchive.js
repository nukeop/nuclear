const apiUrl = "http://coverartarchive.org/"

function releaseGroupFront(mbid, size=250) {
  return fetch(apiUrl + 'release-group/' + mbid + '/' + 'front-' + size);
}

module.exports = {
  releaseGroupFront
}
