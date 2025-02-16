import { range } from 'lodash';
import fetchMock from 'fetch-mock';

import SimilarArtistsService from './SimilarArtistsService';
import { LastFmArtistInfo } from '../../rest/Lastfm.types';
import { SpotifyMock } from '../../../test/spotify-mock';

jest.mock('@electron/remote', () => ({
  exec: jest.fn(),
  getGlobal: jest.fn().mockReturnValue({})
}));

describe('Tests for SimilarArtistsService', () => {
  const underTest = new SimilarArtistsService();

  afterEach(() => {
    fetchMock.reset();
  });

  describe('Create similar artists', () => {
    test('Should return an empty result set if the artist info is missing', async () => {
      expect(await underTest.createSimilarArtists({
        similar: {
          artist: null
        }
      } as LastFmArtistInfo)).toEqual([]);
    });

    test('Should fetch similar artist', async () => {
      const artistInfoFromLastFm = {
        name: 'Artist Name',
        similar: {
          artist: [{
            name: 'Similar artist from LastFm'
          }]
        }
      } as LastFmArtistInfo;

      SpotifyMock.withAccessToken();
      SpotifyMock.withGetTopArtist('Similar artist from LastFm', {
        name: 'Matching similar artist from Spotify',
        images: [{ url: 'thumbnail-url', height: 0, width: 0 }]
      });
      
      expect(await underTest.createSimilarArtists(artistInfoFromLastFm)).toEqual([{
        name: 'Similar artist from LastFm',
        thumbnail: 'thumbnail-url'
      }]);
    });

    test('Should return a null thumbnail set if fetching the artist from Spotify fails', async () => {
      SpotifyMock.withAccessToken();
      SpotifyMock.withSearchArtistsFail('test artist');
      expect(await underTest.createSimilarArtists({
        similar: {
          artist: [{ name: 'test artist' }]
        }
      } as LastFmArtistInfo)).toEqual([{
        name: 'test artist',
        thumbnail: null
      }]);
    });
  });

  test('Should extract the top similar artist names', () => {
    const artistInfoFromLastFm = {
      name: 'Artist Name',
      similar: {
        artist: [
          { name: null },
          { name: 'Artist 1' },
          { name: 'Artist 2' },
          { name: 'Artist 3' },
          { name: null },
          { name: 'Artist 4' },
          { name: 'Artist 5' },
          { name: 'Artist 6' }
        ]
      }
    } as LastFmArtistInfo;
    expect(underTest.extractTopSimilarArtistNames(artistInfoFromLastFm))
      .toEqual(['Artist 1', 'Artist 2', 'Artist 3', 'Artist 4', 'Artist 5']);
  });

  describe('Create top similar artists', () => {
    test('Should create top similar artists', async () => {
      SpotifyMock.withAccessToken();
      range(1, 6).forEach(i => SpotifyMock.withGetTopArtist(
        `Artist ${i}`, 
        { name: `Artist ${i}`, images: [{ url: `Thumbnail of Artist ${i}`, height: 0, width: 0 }]}  
      ));

      expect(await underTest.createTopSimilarArtists(['Artist 1', 'Artist 2', 'Artist 3', 'Artist 4', 'Artist 5']))
        .toEqual([
          { 'name': 'Artist 1', thumbnail: 'Thumbnail of Artist 1' },
          { 'name': 'Artist 2', thumbnail: 'Thumbnail of Artist 2' },
          { 'name': 'Artist 3', thumbnail: 'Thumbnail of Artist 3' },
          { 'name': 'Artist 4', thumbnail: 'Thumbnail of Artist 4' },
          { 'name': 'Artist 5', thumbnail: 'Thumbnail of Artist 5' }
        ]);
    });
  });

  describe('Fetch similar artist thumbnail URL from Spotify', () => {
    test('Should fetch similar artist thumbnail URL', async () => {
      SpotifyMock.withAccessToken();
      SpotifyMock.withGetTopArtist('Artist Name', 
        { 
          id: 'id-1', 
          name: 'Artist Name', 
          images: [{ url: 'the thumbnail URL', height: 0, width: 0 }]
        }
      );

      expect(await underTest.fetchSimilarArtistThumbnailUrlFromSpotify('Artist Name'))
        .toEqual('the thumbnail URL');
    });

    test('Should return no thumbnail URL if fetching fails', async () => {
      SpotifyMock.withSearchArtistsFail('Artist Name');
      expect(await underTest.fetchSimilarArtistThumbnailUrlFromSpotify('Artist Name'))
        .toBeNull();
    });
  });

});
