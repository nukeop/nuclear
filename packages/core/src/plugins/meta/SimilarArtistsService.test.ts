import { SimilarArtist } from '../plugins.types';
import * as SpotifyApi from '../../rest/Spotify';
import { SpotifyArtist } from '../../rest/Spotify';
import { LastFmArtistInfo, LastfmArtistShort } from '../../rest/Lastfm.types';
import SimilarArtistsService from './SimilarArtistsService';

describe('Tests for SimilarArtistsService', () => {
  const underTest = new SimilarArtistsService();

  describe('Create similar artists', () => {
    const createTopSimilarArtists = jest.spyOn(underTest, 'createTopSimilarArtists');

    afterEach(() => {
      createTopSimilarArtists.mockReset();
    });

    afterAll(() => {
      createTopSimilarArtists.mockRestore();
    });

    test('Should return an empty result set if the artist info is missing', async () => {
      expect(await underTest.createSimilarArtists({
        similar: {
          artist: null
        }
      } as LastFmArtistInfo)).toEqual([]);
    });

    test('Should fetch similar artist', async () => {
      const similarArtistsOnLastFm = [{
        name: 'Similar Artist on LastFm'
      }];
      const artistInfoFromLastFm = {
        name: 'Artist Name',
        similar: {
          artist: similarArtistsOnLastFm
        }
      } as LastFmArtistInfo;

      const similarArtist: SimilarArtist = {
        name: 'Similar Artist Name',
        thumbnail: 'the thumbnail'
      };
      createTopSimilarArtists.mockImplementationOnce((artists) => {
        expect(artists).toEqual(similarArtistsOnLastFm);
        return Promise.resolve([similarArtist]);
      });
      expect(await underTest.createSimilarArtists(artistInfoFromLastFm)).toEqual([similarArtist]);
    });

    test('Should return empty result set if creating the top similar artists fails', async () => {
      createTopSimilarArtists.mockRejectedValueOnce('Failed to fetch similar artists');
      expect(await underTest.createSimilarArtists({
        similar: {
          artist: []
        }
      } as LastFmArtistInfo)).toEqual([]);
    });
  });

  describe('Create top similar artists', () => {
    const spotifyToken = 'spotify token';
    const getToken = jest.spyOn(SpotifyApi, 'getToken');

    afterEach(() => {
      getToken.mockReset();
    });

    afterAll(() => {
      getToken.mockRestore();
    });

    test('Should create top similar artists', async () => {
      getToken.mockResolvedValueOnce(spotifyToken);

      const fetchSimilarArtistThumbnailUrlFromSpotify = jest.spyOn(underTest, 'fetchSimilarArtistThumbnailUrlFromSpotify')
        .mockImplementation((artistName, token) => {
          expect(token).toEqual(spotifyToken);
          return Promise.resolve(`Thumbnail of ${artistName}`);
        });

      const artistsFromLastfm = [
        { name: null },
        { name: 'Artist 1' },
        { name: 'Artist 2' },
        { name: 'Artist 3' },
        { name: null },
        { name: 'Artist 4' },
        { name: 'Artist 5' },
        { name: 'Artist 6' }
      ] as LastfmArtistShort[];

      expect(await underTest.createTopSimilarArtists(artistsFromLastfm))
        .toEqual([
          { 'name': 'Artist 1', thumbnail: 'Thumbnail of Artist 1' },
          { 'name': 'Artist 2', thumbnail: 'Thumbnail of Artist 2' },
          { 'name': 'Artist 3', thumbnail: 'Thumbnail of Artist 3' },
          { 'name': 'Artist 4', thumbnail: 'Thumbnail of Artist 4' },
          { 'name': 'Artist 5', thumbnail: 'Thumbnail of Artist 5' }
        ]);
      expect(fetchSimilarArtistThumbnailUrlFromSpotify).toHaveBeenCalledTimes(5);
      fetchSimilarArtistThumbnailUrlFromSpotify.mockRestore();
    });
  });

  describe('Fetch similar artist thumbnail URL from Spotify', () => {
    const searchArtists = jest.spyOn(SpotifyApi, 'searchArtists');

    afterEach(() => {
      searchArtists.mockReset();
    });

    afterAll(() => {
      searchArtists.mockRestore();
    });

    test('Should fetch similar artist thumbnail URL', async () => {
      searchArtists.mockResolvedValueOnce({
        images: [{ url: 'the thumbnail URL' }]
      } as SpotifyArtist);
      expect(await underTest.fetchSimilarArtistThumbnailUrlFromSpotify('Artist Name', 'Spotify token'))
        .toEqual('the thumbnail URL');
    });

    test('Should return no thumbnail URL if fetching fails', async () => {
      searchArtists.mockRejectedValueOnce('Failed to fetch artist');
      expect(await underTest.fetchSimilarArtistThumbnailUrlFromSpotify('Artist Name', 'Spotify token'))
        .toBeNull();
    });
  });

});
