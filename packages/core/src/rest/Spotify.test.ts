import fetchMock from 'fetch-mock';

import { SpotifyArtist, SpotifyClientProvider } from './Spotify';

describe('Spotify tests', () => {
  afterEach(() => {
    fetchMock.reset();
  });
  
  it('gets the token on init', async () => {
    SpotifyMock.withAccessToken();
    const client = SpotifyClientProvider.get();
    await client.init();

    expect(client.token).toEqual('my-spotify-token');
  });

  it('searches artists', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withSearchArtists('test artist', [{
      name: 'test artist 1',
      images: []
    }, {
      name: 'test artist 2',
      images: [{
        height: 300,
        url: 'test-url.com'
      }]
    }]);
    const result = await SpotifyClientProvider.get().searchArtists('test artist');

    expect(result).toEqual([{
      name: 'test artist 1',
      images: []
    }, {
      name: 'test artist 2',
      images: [{
        height: 300,
        url: 'test-url.com'
      }]
    }]);
  });
});

export class SpotifyMock {
  static withAccessToken(accessToken = 'my-spotify-token') {
    fetchMock.get('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', 
      { accessToken });
  }

  static withSearchArtists(query: string, artists: Partial<SpotifyArtist>[]) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
      best_match: { items: artists } 
    });
  }

  static withSearchArtistsFail(query: string) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, 500);
  } 
}
