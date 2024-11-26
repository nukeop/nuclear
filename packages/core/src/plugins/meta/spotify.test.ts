import fetchMock from 'fetch-mock';

import { SpotifyMock } from '../../../test/spotify-mock';
import { SpotifyMetaProvider } from './spotify';

describe('SpotifyMetaProvider', () => {
  const provider = new SpotifyMetaProvider();

  afterEach(() => {
    fetchMock.reset();
  });

  it('searches for arists', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withSearchArtists('test artist', [{
      id: 'test-id-1',
      name: 'test artist 1',
      images: []
    }, {
      id: 'test-id-2',
      name: 'test artist 2',
      images: [{
        height: 300,
        width: 300,
        url: 'test-url.com'
      }]
    }]);
    const result = await provider.searchForArtists('test artist');

    expect(result).toEqual([{
      id: 'test-id-1',
      coverImage: undefined,
      thumb: undefined,
      name: 'test artist 1',
      source: 'Spotify'
    }, {
      id: 'test-id-2',
      coverImage: 'test-url.com',
      thumb: 'test-url.com',
      name: 'test artist 2',
      source: 'Spotify'
    }]);
  });

  it('searches for albums', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withSearchReleases('test album', [{
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [{
        height: 300,
        width: 300, 
        url: 'thumbnail.jpg'
      }, {
        height: 600,
        width: 600,
        url: 'image.jpg'
      }, {
        height: 1000,
        width: 1000,
        url: 'large.jpg'
      }],
      name: 'test album',
      release_date: '2020-01',
      artists: [{ name: 'test artist' }]
    }]);
    const result = await provider.searchForReleases('test album');
    
    expect(result).toEqual([{
      id: 'album-id',
      thumb: 'thumbnail.jpg',
      coverImage: 'large.jpg',
      images: ['thumbnail.jpg', 'image.jpg', 'large.jpg'],
      title: 'test album',
      artist: 'test artist',
      resourceUrl: 'album-href',
      year: '2020-01',
      source: 'Spotify'
    }]);
  });

  it('searches for tracks', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withSearchTracks('test track', [{
      id: 'track-id',
      name: 'test track',
      href: 'track-href',
      album: {
        id: 'album-id',
        name: 'test album',
        images: [{
          height: 300,
          width: 300,
          url: 'thumbnail.jpg'
        }]
      },
      artists: [{ name: 'test artist' }],
      popularity: 50,
      track_number: 1,
      duration_ms: 1000
    }]);
    const result = await provider.searchForTracks('test track');
    
    expect(result).toEqual([{
      id: 'track-id',
      title: 'test track',
      artist: 'test artist',
      source: 'Spotify',
      thumb: 'thumbnail.jpg'
    }]);
  });

  it('fetches artist details', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetArtistDetails('test-id', {
      id: 'test-id',
      name: 'test artist',
      images: [{
        height: 300,
        width: 300,
        url: 'thumbnail.jpg'
      }, {
        height: 600,
        width: 600,
        url: 'image.jpg'
      }, {
        height: 1000,
        width: 1000,
        url: 'large.jpg'
      }],
      genres: ['pop'],
      popularity: 50
    });
    SpotifyMock.withGetArtistTopTracks('test-id', [{
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
    }, {
      id: 'track-id-2',
      name: 'test track 2',
      href: 'track-href-2',
      album: {
        id: 'album-id',
        name: 'test album',
        images: []
      },
      artists: [{ name: 'test artist' }],
      popularity: 100,
      track_number: 2,
      duration_ms: 1000
    }]);
    SpotifyMock.withGetSimilarArtists('test-id', [{
      id: 'similar-id',
      name: 'similar artist 1',
      images: []
    }, {
      id: 'similar-id-2',
      name: 'similar artist 2',
      images: []
    }]);
    const result = await provider.fetchArtistDetails('test-id');

    expect(result).toEqual({
      id: 'test-id',
      name: 'test artist',
      coverImage: 'large.jpg',
      thumb: 'thumbnail.jpg',
      source: 'Spotify',
      images: ['thumbnail.jpg', 'image.jpg', 'large.jpg'],
      topTracks: [{
        title: 'test track',
        artist: { name: 'test artist' },
        thumb: undefined,
        playcount: 100,
        listeners: 100
      }, {
        title: 'test track 2',
        artist: {name: 'test artist'},
        thumb: undefined,
        playcount: 100,
        listeners: 100
      }],
      similar: [{
        name: 'similar artist 1',
        thumbnail: undefined
      }, {
        name: 'similar artist 2',
        thumbnail: undefined
      }]
    });
  });

  it('fetches artist details by name', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetTopArtist('test artist', {
      id: 'test-id',
      name: 'test artist',
      images: [{
        height: 300,
        width: 300,
        url: 'thumbnail.jpg'
      }, {
        height: 600,
        width: 600,
        url: 'image.jpg'
      }, {
        height: 1000,
        width: 1000,
        url: 'large.jpg'
      }]
    });
    SpotifyMock.withGetArtistTopTracks('test-id', [{
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
    }, {
      id: 'track-id-2',
      name: 'test track 2',
      href: 'track-href-2',
      album: {
        id: 'album-id',
        name: 'test album',
        images: []
      },
      artists: [{ name: 'test artist' }],
      popularity: 100,
      track_number: 2,
      duration_ms: 1000
    }]);
    SpotifyMock.withGetSimilarArtists('test-id', [{
      id: 'similar-id',
      name: 'similar artist 1',
      images: []
    }, {
      id: 'similar-id-2',
      name: 'similar artist 2',
      images: []
    }]);
    const result = await provider.fetchArtistDetailsByName('test artist');
    
    expect(result).toEqual({
      id: 'test-id',
      name: 'test artist',
      coverImage: 'large.jpg',
      thumb: 'thumbnail.jpg',
      source: 'Spotify',
      images: ['thumbnail.jpg', 'image.jpg', 'large.jpg'],
      topTracks: [{
        title: 'test track',
        artist: { name: 'test artist' },
        thumb: undefined,
        playcount: 100,
        listeners: 100
      }, {
        title: 'test track 2',
        artist: {name: 'test artist'},
        thumb: undefined,
        playcount: 100,
        listeners: 100
      }],
      similar: [{
        name: 'similar artist 1',
        thumbnail: undefined
      }, {
        name: 'similar artist 2',
        thumbnail: undefined
      }]
    });
  });

  it('fetches artist\'s albums', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetArtistsAlbums('test-id', [{
      id: 'album-id',
      album_type: 'album',
      total_tracks: 10,
      href: 'album-href',
      images: [{
        height: 300,
        width: 300,
        url: 'thumbnail.jpg'
      }, {
        height: 600,
        width: 600,
        url: 'image.jpg'
      }, {
        height: 1000,
        width: 1000,
        url: 'large.jpg'
      }],
      name: 'test album',
      release_date: '2020-01',
      artists: [{ name: 'test artist' }]
    }]);
    const result = await provider.fetchArtistAlbums('test-id');
    
    expect(result).toEqual([{
      id: 'album-id',
      thumb: 'thumbnail.jpg',
      coverImage: 'large.jpg',
      images: ['thumbnail.jpg', 'image.jpg', 'large.jpg'],
      title: 'test album',
      artist: 'test artist',
      resourceUrl: 'album-href',
      year: '2020-01',
      source: 'Spotify'
    }]);
  });

  it('fetches album details', async () => {
    SpotifyMock.withAccessToken();
    SpotifyMock.withGetAlbum('test-id', {
      id: 'test-id',
      artists: [{name: 'test artist'}],
      name: 'test album',
      images: [
        { url: 'thumbnail.jpg', height: 300, width: 300 }, 
        { url: 'image.jpg', height: 600, width: 600 },
        { url: 'large.jpg', height: 1000, width: 1000 }
      ],
      genres: ['pop'],
      release_date: '2020-01',
      album_type: 'album',
      tracks: {
        href: 'tracks-href',
        limit: 10,
        next: null,
        offset: 0,
        previous: null,
        total: 2,
        items: [{
          id: 'track-id',
          href: 'track-href',
          track_number: 1,
          name: 'test track',
          artists: [{ name: 'test artist' }],
          duration_ms: 1000,
          disc_number: 0,
          type: 'track'
        }]
      },
      href: 'album-href'
    });
    const result = await provider.fetchAlbumDetails('test-id', 'master');
    
    expect(result).toEqual({
      id: 'test-id',
      artist: 'test artist',
      title: 'test album',
      thumb: 'thumbnail.jpg',
      coverImage: 'large.jpg',
      images: ['thumbnail.jpg', 'image.jpg', 'large.jpg'],
      genres: ['pop'],
      year: '2020-01',
      tracklist: [{
        ids: {},
        uuid: expect.any(String),
        position: 1,
        name: 'test track',
        title: 'test track',
        artist: 'test artist',
        duration: 1,
        discNumber: 0,
        thumbnail: 'thumbnail.jpg'
      }]
    });
  });
});
