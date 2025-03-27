import { SoundcloudMetaProvider } from './SoundcloudPlugin';
import { SearchResultsSource } from '../plugins.types';

jest.mock('soundcloud.ts', () => {
  return function() {
    return {
      users: {
        search: jest.fn(),
        get: jest.fn(),
        tracks: jest.fn()
      },
      tracks: {
        search: jest.fn()
      }
    };
  };
});

describe('SoundcloudMetaProvider', () => {
  let provider: SoundcloudMetaProvider;
  
  beforeEach(() => {
    provider = new SoundcloudMetaProvider();
    jest.clearAllMocks();
  });

  describe('searchForArtists', () => {
    it('should convert Soundcloud artists to SearchResultsArtist format', async () => {
      const mockArtists = {
        collection: [
          {
            id: 123456,
            avatar_url: 'https://example.com/avatar.jpg',
            username: 'Test Artist',
            permalink_url: 'https://soundcloud.com/testartist'
          }
        ]
      };
      
      provider.soundcloud.users.search = jest.fn().mockResolvedValue(mockArtists);

      const results = await provider.searchForArtists('Test Artist');

      expect(provider.soundcloud.users.search).toHaveBeenCalledWith({ q: 'Test Artist' });
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        id: '123456',
        coverImage: 'https://example.com/avatar.jpg',
        thumb: 'https://example.com/avatar.jpg',
        name: 'Test Artist',
        image: 'https://example.com/avatar.jpg',
        url: 'https://soundcloud.com/testartist',
        resourceUrl: 'https://soundcloud.com/testartist',
        source: SearchResultsSource.Soundcloud
      });
    });
  });

  describe('searchForTracks', () => {
    it('should convert Soundcloud tracks to SearchResultsTrack format', async () => {
      const mockTracks = {
        collection: [
          {
            id: 987654,
            title: 'Test Track',
            user: {
              username: 'Test Artist'
            }
          }
        ]
      };
      
      provider.soundcloud.tracks.search = jest.fn().mockResolvedValue(mockTracks);

      const results = await provider.searchForTracks('Test Track');

      expect(provider.soundcloud.tracks.search).toHaveBeenCalledWith({ q: 'Test Track' });
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        id: '987654',
        title: 'Test Track',
        artist: 'Test Artist',
        source: SearchResultsSource.Soundcloud
      });
    });
  });

  describe('fetchArtistDetails', () => {
    it('should fetch artist details and convert to ArtistDetails format', async () => {
      const mockArtist = {
        id: 123456,
        username: 'Test Artist',
        description: 'This is a test artist description',
        avatar_url: 'https://example.com/avatar.jpg'
      };
      
      const mockTracks = [
        {
          id: 987654,
          title: 'Top Track 1',
          user: {
            username: 'Test Artist'
          },
          playback_count: 1000,
          likes_count: 500
        },
        {
          id: 987655,
          title: 'Top Track 2',
          user: {
            username: 'Test Artist'
          },
          playback_count: 800,
          likes_count: 400
        }
      ];
      
      provider.soundcloud.users.get = jest.fn().mockResolvedValue(mockArtist);
      provider.soundcloud.users.tracks = jest.fn().mockResolvedValue(mockTracks);

      const result = await provider.fetchArtistDetails('123456');

      expect(provider.soundcloud.users.get).toHaveBeenCalledWith('123456');
      expect(provider.soundcloud.users.tracks).toHaveBeenCalledWith(123456);
      
      expect(result).toEqual({
        id: '123456',
        name: 'Test Artist',
        description: 'This is a test artist description',
        coverImage: 'https://example.com/avatar.jpg',
        similar: [],
        topTracks: [
          {
            artist: { name: 'Test Artist' },
            title: 'Top Track 1',
            playcount: 1000,
            listeners: 500
          },
          {
            artist: { name: 'Test Artist' },
            title: 'Top Track 2',
            playcount: 800,
            listeners: 400
          }
        ],
        source: SearchResultsSource.Soundcloud
      });
    });
  });

  describe('fetchArtistDetailsByName', () => {
    it('should search for artist and then fetch details', async () => {
      const mockSearch = {
        collection: [
          {
            id: 123456,
            username: 'Test Artist'
          }
        ]
      };

      const mockArtistDetails = {
        id: '123456',
        name: 'Test Artist',
        description: 'Artist description',
        coverImage: 'https://example.com/avatar.jpg',
        similar: [],
        topTracks: [],
        source: SearchResultsSource.Soundcloud
      };
      
      provider.soundcloud.users.search = jest.fn().mockResolvedValue(mockSearch);
      provider.fetchArtistDetails = jest.fn().mockResolvedValue(mockArtistDetails);

      const result = await provider.fetchArtistDetailsByName('Test Artist');

      expect(provider.soundcloud.users.search).toHaveBeenCalledWith({ q: 'Test Artist' });
      expect(provider.fetchArtistDetails).toHaveBeenCalledWith('123456');
      expect(result).toEqual(mockArtistDetails);
    });

    it('should throw an error when artist is not found', async () => {
      const mockSearch = {
        collection: []
      };
      
      provider.soundcloud.users.search = jest.fn().mockResolvedValue(mockSearch);

      await expect(provider.fetchArtistDetailsByName('Nonexistent Artist')).rejects.toThrow('Artist not found');
    });
  });

  describe('searchForReleases', () => {
    it('should return an empty array', async () => {
      const mockTracks = {
        collection: [
          {
            id: 987654,
            title: 'Test Track',
            user: {
              username: 'Test Artist'
            }
          }
        ]
      };
      
      provider.soundcloud.tracks.search = jest.fn().mockResolvedValue(mockTracks);

      const results = await provider.searchForReleases('Test Release');

      expect(provider.soundcloud.tracks.search).toHaveBeenCalledWith({ q: 'Test Release' });
      expect(results).toEqual([]);
    });
  });

  describe('fetchAlbumDetails and fetchAlbumDetailsByName', () => {
    it('should return null for fetchAlbumDetails', async () => {
      const result = await provider.fetchAlbumDetails('123', 'master');
      expect(result).toBeNull();
    });

    it('should return null for fetchAlbumDetailsByName', async () => {
      const result = await provider.fetchAlbumDetailsByName('Test Album', 'master', 'Test Artist');
      expect(result).toBeNull();
    });
  });
});
