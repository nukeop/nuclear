import md5 from 'md5';

const scrobblingApiUrl = 'https://ws.audioscrobbler.com/2.0/';

class LastFmApi {
  constructor(key, secret) {
    this.key = key;
    this.secret = secret;
  }

  sign(url) {
    let tokens = decodeURIComponent((url.split('?')[1].split('&').sort().join()).replace(/,/g, '').replace(/=/g, ''));

    return md5(tokens + this.secret);
  }

  prepareUrl(url) {
    let withApiKey = `${url}&api_key=${this.key}`;
    return `${withApiKey}&api_sig=${this.sign(withApiKey)}` ;
  }

  addApiKey(url) {
    return `${url}&api_key=${this.key}`;
  }

  lastFmLoginConnect() {
    return fetch(this.prepareUrl(scrobblingApiUrl + '?method=auth.getToken&format=json'));
  }

  lastFmLogin(authToken) {
    return fetch(this.prepareUrl(scrobblingApiUrl + '?method=auth.getSession&token=' + authToken)+'&format=json');
  }

  scrobble(artist, track, session) {
    return fetch(this.prepareUrl(
      scrobblingApiUrl +
        '?method=track.scrobble&sk=' +
        session +
        '&artist=' +
        encodeURIComponent(artist) +
        '&track=' +
        encodeURIComponent(track) +
        '&timestamp=' +
        (Math.floor(new Date()/1000 - 540))),
    {
      method: 'POST'
    }
    );
  }

  updateNowPlaying(artist, track, session) {
    return fetch(this.prepareUrl(
      scrobblingApiUrl +
        '?method=track.updateNowPlaying&sk=' +
        session +
        '&artist=' +
        encodeURIComponent(artist) +
        '&track=' +
        encodeURIComponent(track)),
    {
      method: 'POST'
    }
    );
  }

  getArtistInfo(artist) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=artist.getinfo&artist=' +
        encodeURIComponent(artist) +
        '&format=json'
    ));
  }

  getArtistTopTracks(artist) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=artist.gettoptracks&artist=' +
        encodeURIComponent(artist) +
        '&format=json'
    ));
  }

  getTopTags() {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopTags&format=json'
    ));
  }

  getTopTracks() {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=chart.getTopTracks&format=json'
    ));
  }

  getTagInfo(tag) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getInfo&format=json&tag=' +
        tag
    ));
  }

  getTagTracks(tag) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopTracks&format=json&tag=' +
        tag
    ));
  }

  getTagAlbums(tag) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopAlbums&format=json&tag=' +
        tag
    ));
  }

  getTagArtists(tag) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopArtists&format=json&tag=' +
        tag
    ));
  }

  getSimilarTags(tag) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getSimilar&format=json&tag=' +
        tag
    ));
  }

  getSimilarTracks(artist, track, limit=100) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=track.getSimilar&format=json&artist=' +
        artist +
        '&track=' +
        track +
        '&limit=' +
        limit
    ));
  }

  searchTracks(terms, limit=30) {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=track.search&format=json&track=' +
        encodeURIComponent(terms) +
        '&limit=' +
        limit
    ));
  }

}

export default LastFmApi;
