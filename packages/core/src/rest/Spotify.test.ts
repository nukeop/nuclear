import fetchMock from 'fetch-mock';

import { SpotifyArtist, SpotifyClientProvider, SpotifySimplifiedAlbum, SpotifyTrack } from './Spotify';

describe('Spotify tests', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it('gets the token on init', async () => {
    SpotifyMock.withAccessToken();
    const client = await SpotifyClientProvider.get();
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
        width: 300,
        url: 'test-url.com'
      }]
    }]);
    const result = await (await SpotifyClientProvider.get()).searchArtists('test artist');

    expect(result).toEqual([{
      name: 'test artist 1',
      images: []
    }, {
      name: 'test artist 2',
      images: [{
        height: 300,
        width: 300,
        url: 'test-url.com'
      }]
    }]);
  });

  it('searches albums', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withSearchReleases('test album', [{
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    }]);
    const result = await (await SpotifyClientProvider.get()).searchReleases('test album');

    expect(result).toEqual([{
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    }]);
  });

  it('searches tracks', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withSearchTracks('test track', [{
      id: 'track-id',
      name: 'test track',
      href: 'track-href',
      album: {
        id: 'album-id',
        images: []
      },
      artists: [{ name: 'test artist' }],
      popularity: 100,
      track_number: 1
    }]);
    const result = await (await SpotifyClientProvider.get()).searchTracks('test track');

    expect(result).toEqual([{
      id: 'track-id',
      name: 'test track',
      href: 'track-href',
      album: {
        id: 'album-id',
        images: []
      },
      artists: [{ name: 'test artist' }],
      popularity: 100,
      track_number: 1
    }]);
  });
});

export class SpotifyMock {
  static withAccessToken(accessToken = 'my-spotify-token') {
    fetchMock.get('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', 
      { accessToken });
  }

  static withSearchArtists(query: string, artists: Partial<SpotifyArtist>[], limit=10) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=${limit}`, {
      artists: { items: artists } 
    });
  }

  static withGetTopArtist(query: string, artist: Partial<SpotifyArtist>) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
      best_match: { items: [artist] } 
    });
  }

  static withSearchArtistsFail(query: string) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, 500);
  } 

  static withSearchReleases(query: string, releases: Partial<SpotifySimplifiedAlbum>[], limit=10) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=${limit}`, {
      albums: { items: releases } 
    });
  }

  static withSearchTracks(query: string, tracks: Partial<SpotifyTrack>[], limit=20) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=${limit}`, {
      tracks: { items: tracks } 
    });
  }
}
