import fetchMock from 'fetch-mock';

import { SpotifyClientProvider } from './Spotify';
import { SpotifyMock } from '../../test/spotify-mock';

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
        name: 'test album',
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
        name: 'test album',
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
        name: 'test album',
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
          name: 'test album',
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
        name: 'test album',
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
        name: 'test album',
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
