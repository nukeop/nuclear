import md5 from 'md5';

const scrobblingApiUrl = 'https://ws.audioscrobbler.com/2.0/';

class LastFmApi {
  constructor(
    private key: string,
    private secret: string
  ) {}

  sign(url: string): string {
    const tokens = decodeURIComponent((url.split('?')[1].split('&').sort().join()).replace(/,/g, '').replace(/=/g, ''));

    return md5(tokens + this.secret);
  }

  prepareUrl(url: string): string {
    const withApiKey = `${url}&api_key=${this.key}`;
  
    return `${withApiKey}&api_sig=${this.sign(withApiKey)}` ;
  }

  addApiKey(url: string): string {
    return `${url}&api_key=${this.key}`;
  }

  lastFmLoginConnect(): Promise<Response> {
    return fetch(this.prepareUrl(scrobblingApiUrl + '?method=auth.getToken&format=json'));
  }

  lastFmLogin(authToken: string): Promise<Response> {
    return fetch(this.prepareUrl(scrobblingApiUrl + '?method=auth.getSession&token=' + authToken)+'&format=json');
  }

  scrobble(artist: string, track: string, session: string): Promise<Response> {
    return fetch(this.prepareUrl(
      scrobblingApiUrl +
        '?method=track.scrobble&sk=' +
        session +
        '&artist=' +
        encodeURIComponent(artist) +
        '&track=' +
        encodeURIComponent(track) +
        '&timestamp=' +
        (Math.floor(Date.now() /1000 - 540))),
    {
      method: 'POST'
    }
    );
  }

  updateNowPlaying(artist: string, track: string, session: string): Promise<Response> {
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

  getArtistInfo(artist: string): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=artist.getinfo&artist=' +
        encodeURIComponent(artist) +
        '&format=json'
    ));
  }

  getArtistTopTracks(artist: string): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=artist.gettoptracks&artist=' +
        encodeURIComponent(artist) +
        '&format=json'
    ));
  }

  getTopTags(): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopTags&format=json'
    ));
  }

  getTopTracks(): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=chart.getTopTracks&format=json'
    ));
  }

  getTagInfo(tag: string): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getInfo&format=json&tag=' +
        tag
    ));
  }

  getTagTracks(tag: string): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopTracks&format=json&tag=' +
        tag
    ));
  }

  getTagAlbums(tag: string): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopAlbums&format=json&tag=' +
        tag
    ));
  }

  getTagArtists(tag: string): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getTopArtists&format=json&tag=' +
        tag
    ));
  }

  getSimilarTags(tag: string): Promise<Response> {
    return fetch(this.addApiKey(
      scrobblingApiUrl +
        '?method=tag.getSimilar&format=json&tag=' +
        tag
    ));
  }

  getSimilarTracks(artist: string, track: string, limit = 100): Promise<Response> {
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

  searchTracks(terms: string, limit = 30): Promise<Response> {
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
