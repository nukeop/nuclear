import md5 from 'md5';
import { LastFmArtistInfo, LastfmAlbum, LastfmArtistShort, LastfmTag, LastfmTrackMatch } from './Lastfm.types';

const scrobblingApiUrl = 'https://ws.audioscrobbler.com/2.0/';

class LastFmApi {
  constructor(
    private key: string,
    private secret: string
  ) { }

  sign(url: string): string {
    const tokens = decodeURIComponent((url.split('?')[1].split('&').sort().join()).replace(/,/g, '').replace(/=/g, ''));

    return md5(tokens + this.secret);
  }

  prepareUrl(url: string): string {
    const withApiKey = `${url}&api_key=${this.key}`;

    return `${withApiKey}&api_sig=${this.sign(withApiKey)}`;
  }

  addApiKey(url: string): string {
    return `${url}&api_key=${this.key}`;
  }

  lastFmLoginConnect(): Promise<Response> {
    return fetch(this.prepareUrl(scrobblingApiUrl + '?method=auth.getToken&format=json'));
  }

  lastFmLogin(authToken: string): Promise<Response> {
    return fetch(this.prepareUrl(scrobblingApiUrl + '?method=auth.getSession&token=' + authToken) + '&format=json');
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
      (Math.floor(Date.now() / 1000 - 540))),
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

  async getTagInfo(tag: string): Promise<LastfmTag> {
    const result = await (await fetch(this.addApiKey(
      scrobblingApiUrl +
      '?method=tag.getInfo&format=json&tag=' +
      tag
    ))).json();

    return result.tag as LastfmTag;
  }

  async getTagTracks(tag: string): Promise<LastfmTrackMatch[]> {
    const result = await (await fetch(this.addApiKey(
      scrobblingApiUrl +
      '?method=tag.getTopTracks&format=json&tag=' +
      tag
    ))).json();

    return result.tracks.track as LastfmTrackMatch[];
  }

  async getTagAlbums(tag: string): Promise<LastfmAlbum[]> {
    const result = await (await fetch(this.addApiKey(
      scrobblingApiUrl +
      '?method=tag.getTopAlbums&format=json&tag=' +
      tag
    ))).json();
    return result.albums.album as LastfmAlbum[];
  }

  async getTagArtists(tag: string): Promise<LastfmArtistShort[]> {
    const result = await (await fetch(this.addApiKey(
      scrobblingApiUrl +
      '?method=tag.getTopArtists&format=json&tag=' +
      tag
    ))).json();

    return result.topartists.artist as LastfmArtistShort[];
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

  getLovedTracks(user: string, limit = 1, page = 1): Promise<Response> {
    return fetch(`${scrobblingApiUrl}?method=user.getlovedtracks&user=${user}&format=json&limit=${limit}&page=${page}&api_key=${this.key}`,
      {
        method: 'POST'
      }
    );
  }
}

export default LastFmApi;
