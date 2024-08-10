import fetchMock from 'fetch-mock';

import { SpotifyArtist, SpotifyClientProvider, SpotifyFullArtist, SpotifySimplifiedAlbum, SpotifyTrack } from './Spotify';

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

  it('searches all', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withSearchAll('test', [{
      name: 'test artist',
      images: []
    }], [{
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    }], [{
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
    const result = await (await SpotifyClientProvider.get()).searchAll('test');

    expect(result).toEqual({
      artists: [{
        name: 'test artist',
        images: []
      }],
      releases: [{
        id: 'album-id',
        album_type: 'album',
        total_tracks: 10,
        href: 'album-href',
        images: [],
        name: 'test album',
        release_date: '2020-01-01',
        artists: [{ name: 'test artist' }]
      }],
      tracks: [{
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
      }]
    });
  });

  it('gets artist details', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetArtistDetails('artist-id', {
      name: 'test artist',
      images: [],
      genres: ['pop'],
      popularity: 100
    });
    const result = await (await SpotifyClientProvider.get()).getArtistDetails('artist-id');

    expect(result).toEqual({
      name: 'test artist',
      images: [],
      genres: ['pop'],
      popularity: 100
    });
  });

  it('gets artist\'s top tracks', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetArtistTopTracks('artist-id', [{
      id: 'track-id',
      name: 'test track',
      href: 'track-href',
      album: {
        id: 'album-id',
        images: []
      },
      artists: [{ name: 'test artist' }],
      popularity: 100,
      track_number: 1,
      duration_ms: 1000
    }]);
    const result = await (await SpotifyClientProvider.get()).getArtistTopTracks('artist-id');

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
      track_number: 1,
      duration_ms: 1000
    }]);
  });

  it('gets similar artists', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetSimilarArtists('artist-id', [{
      name: 'test artist',
      images: []
    }]);
    const result = await (await SpotifyClientProvider.get()).getSimilarArtists('artist-id');

    expect(result).toEqual([{
      name: 'test artist',
      images: []
    }]);
  });

  it('gets artist\'s albums', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetArtistsAlbums('artist-id', [{
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    }]);
    const result = await (await SpotifyClientProvider.get()).getArtistsAlbums('artist-id');

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

  it('gets an album', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetAlbum('album-id', {
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    });
    const result = await (await SpotifyClientProvider.get()).getAlbum('album-id');

    expect(result).toEqual({
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    });
  });

  it('gets the top artist', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetTopArtist('test artist', {
      name: 'test artist',
      images: []
    });
    const result = await (await SpotifyClientProvider.get()).getTopArtist('test artist');

    expect(result).toEqual({
      name: 'test artist',
      images: []
    });
  });

  it('gets the top album', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetTopAlbum('test album', {
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    });
    const result = await (await SpotifyClientProvider.get()).getTopAlbum('test album');

    expect(result).toEqual({
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [],
      name: 'test album',
      release_date: '2020-01-01',
      artists: [{ name: 'test artist' }]
    });
  });
});

export class SpotifyMock {
  static withAccessToken(accessToken = 'my-spotify-token') {
    fetchMock.get('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', 
      { accessToken });
  }

  static withSearchArtists(query: string, artists: Partial<SpotifyArtist>[], limit=10) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=${limit}`, {
      artists: { items: artists } 
    });
  }

  static withGetTopArtist(query: string, artist: Partial<SpotifyArtist>) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
      best_match: { items: [artist] } 
    });
  }

  static withSearchArtistsFail(query: string) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=1`, 500);
  } 

  static withSearchReleases(query: string, releases: Partial<SpotifySimplifiedAlbum>[], limit=10) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=${limit}`, {
      albums: { items: releases } 
    });
  }

  static withSearchTracks(query: string, tracks: Partial<SpotifyTrack>[], limit=20) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=${limit}`, {
      tracks: { items: tracks } 
    });
  }

  static withSearchAll(query: string, artists: Partial<SpotifyArtist>[], releases: Partial<SpotifySimplifiedAlbum>[], tracks: Partial<SpotifyTrack>[]) {
    fetchMock.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist,album,track&decorate_restrictions=false&include_external=audio`, {
      artists: { items: artists },
      albums: { items: releases },
      tracks: { items: tracks }
    });
  }

  static withGetArtistDetails(artistId: string, artist: Partial<SpotifyFullArtist>) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}`, artist);
  }

  static withGetArtistTopTracks(artistId: string, tracks: Partial<SpotifyTrack>[]) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, { tracks });
  }

  static withGetSimilarArtists(artistId: string, artists: Partial<SpotifyArtist>[]) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, { artists });
  }

  static withGetArtistsAlbums(artistId: string, albums: Partial<SpotifySimplifiedAlbum>[]) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album`, { items: albums });
  }

  static withGetAlbum(albumId: string, album: Partial<SpotifySimplifiedAlbum>) {
    fetchMock.get(`https://api.spotify.com/v1/albums/${albumId}`, album);
  }

  static withGetTopAlbum(query: string, album: Partial<SpotifySimplifiedAlbum>) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
      best_match: { items: [album] } 
    });
  }
  
}
