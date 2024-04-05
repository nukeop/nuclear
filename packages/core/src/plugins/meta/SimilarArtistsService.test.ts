import { SimilarArtist } from '../plugins.types';
import * as SpotifyApi from '../../rest/Spotify';
import { SpotifyArtist } from '../../rest/Spotify';
import { LastFmArtistInfo, LastfmArtistShort } from '../../rest/Lastfm.types';
import SimilarArtistsService from './SimilarArtistsService';

describe('Tests for SimilarArtistsService', () => {
  const underTest = new SimilarArtistsService();

  describe('Get similar artists', () => {
    const spotifyToken = 'spotify token';
    const getToken = jest.spyOn(SpotifyApi, 'getToken');
    const fetchTopSimilarArtistsFromSpotify = jest.spyOn(underTest, 'fetchTopSimilarArtistsFromSpotify');

    afterEach(() => {
      getToken.mockReset();
      fetchTopSimilarArtistsFromSpotify.mockReset();
    });

    afterAll(() => {
      getToken.mockRestore();
      fetchTopSimilarArtistsFromSpotify.mockRestore();
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

      getToken.mockResolvedValueOnce(spotifyToken);

      const similarArtist: SimilarArtist = {
        name: 'Similar Artist Name',
        thumbnail: 'the thumbnail'
      };
      fetchTopSimilarArtistsFromSpotify.mockImplementationOnce((artists, token) => {
        expect(token).toEqual(spotifyToken);
        expect(artists).toEqual(similarArtistsOnLastFm);
        return Promise.resolve([similarArtist]);
      });
      expect(await underTest.createSimilarArtists(artistInfoFromLastFm)).toEqual([similarArtist]);
    });

    test('Should return empty result set if fetching the Spotify token fails', async () => {
      getToken.mockRejectedValueOnce('Failed to fetch Spotify token');
      expect(await underTest.createSimilarArtists({
        similar: {
          artist: []
        }
      } as LastFmArtistInfo)).toEqual([]);
    });

    test('Should return empty result set if fetching the artists from Spotify fails', async () => {
      getToken.mockResolvedValueOnce(spotifyToken);
      fetchTopSimilarArtistsFromSpotify.mockRejectedValueOnce('Failed to fetch similar artists');
      expect(await underTest.createSimilarArtists({
        similar: {
          artist: []
        }
      } as LastFmArtistInfo)).toEqual([]);
    });
  });

  describe('Fetch top similar artists from Spotify', () => {

    test('Should fetch similar artists from Spotify', async () => {
      const fetchSimilarArtistFromSpotify = jest.spyOn(underTest, 'fetchSimilarArtistFromSpotify')
        .mockImplementation((artistName, token) => {
          return Promise.resolve({
            name: `Spotify: ${artistName}`
          } as SimilarArtist);
        });

      const spotifyToken = 'Spotify token';
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

      expect(await underTest.fetchTopSimilarArtistsFromSpotify(artistsFromLastfm, spotifyToken))
        .toEqual([
          { 'name': 'Spotify: Artist 1' },
          { 'name': 'Spotify: Artist 2' },
          { 'name': 'Spotify: Artist 3' },
          { 'name': 'Spotify: Artist 4' },
          { 'name': 'Spotify: Artist 5' }
        ]);
      expect(fetchSimilarArtistFromSpotify).toHaveBeenCalledTimes(5);
      fetchSimilarArtistFromSpotify.mockRestore();
    });
  });

  describe('Fetch similar artist from Spotify', () => {
    const searchArtists = jest.spyOn(SpotifyApi, 'searchArtists');

    afterEach(() => {
      searchArtists.mockReset();
    });

    afterAll(() => {
      searchArtists.mockRestore();
    });

    test('Should fetch similar artist', async () => {
      searchArtists.mockResolvedValueOnce({
        images: [{ url: 'the thumbnail URL' }]
      } as SpotifyArtist);
      expect(await underTest.fetchSimilarArtistFromSpotify('Artist Name', 'Spotify token'))
        .toEqual({
          name: 'Artist Name',
          thumbnail: 'the thumbnail URL'
        });
    });

    test('Should return shallow similar artist if fetching fails', async () => {
      searchArtists.mockRejectedValueOnce('Failed to fetch artist');
      expect(await underTest.fetchSimilarArtistFromSpotify('Artist Name', 'Spotify token'))
        .toEqual({
          name: 'Artist Name',
          thumbnail: null
        });
    });
  });

});
