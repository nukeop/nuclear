import { BandcampPlugin } from '.';
import fn = jest.fn;
import { Bandcamp } from '../../rest';
import spyOn = jest.spyOn;
import { BandcampSearchResult } from '../../rest/Bandcamp';

describe('Bandcamp plugin tests', () => {
  let plugin: BandcampPlugin;

  beforeEach(() => {
    plugin = new BandcampPlugin();
  });

  describe('find track URLs', () => {
    const streamQuery = {
      artist: 'Artist Name',
      track: 'Track Name'
    };
    const trackQuery = 'Artist Name Track Name';
    const bandcampSearch = spyOn(Bandcamp, 'search');

    beforeEach(() => {
      spyOn(plugin, 'createTrackQuery')
        .mockImplementation(fn(() => trackQuery));
      // 'accept all' matcher
      spyOn(plugin, 'createTrackMatcher')
        .mockImplementation(fn(query => () => true));
    });

    afterEach(() => {
      bandcampSearch.mockReset();
    });

    test('finds track', async () => {
      const matchingSearchResult: BandcampSearchResult = {
        type: 'track',
        artist: 'Artist Name',
        name: 'Track Name',
        url: 'URL',
        imageUrl: 'image URL',
        tags: []
      };
      bandcampSearch.mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([matchingSearchResult]);

      await expect(plugin.findTrackUrls(streamQuery))
        .resolves.toEqual([matchingSearchResult]);

      expect(bandcampSearch).toHaveBeenCalledTimes(5);
      expect(bandcampSearch).toHaveBeenNthCalledWith(1, trackQuery, 0);
      expect(bandcampSearch).toHaveBeenNthCalledWith(2, trackQuery, 1);
      expect(bandcampSearch).toHaveBeenNthCalledWith(3, trackQuery, 2);
      expect(bandcampSearch).toHaveBeenNthCalledWith(4, trackQuery, 3);
      expect(bandcampSearch).toHaveBeenNthCalledWith(5, trackQuery, 4);
    });

    test('doesn\'t find tracks', async () => {
      bandcampSearch.mockResolvedValue([]);

      await expect(plugin.findTrackUrls(streamQuery))
        .resolves.toEqual([]);

      expect(bandcampSearch).toHaveBeenCalledTimes(5);
    });
  });

  test('creates track query', () => {
    const streamQuery = {
      artist: 'Artist Name',
      track: 'Track Name'
    };
    const trackQuery = plugin.createTrackQuery(streamQuery);
    expect(trackQuery).toBe('Artist Name Track Name');
  });

  test('creates track matcher', () => {
    const streamQuery = {
      artist: 'Artist Name',
      track: 'Track Name'
    };
    const matcher = plugin.createTrackMatcher(streamQuery);
    const matchingResult = {
      type: 'track',
      artist: 'Artist Name',
      name: 'Track Name'
    };
    const searchResults = [
      matchingResult, // first match
      {
        type: 'album' // type shouldn't match
      },
      {
        type: 'artist' // type shouldn't match
      },
      {
        type: 'track',
        artist: 'Wrong Artist' // artist shouldn't match
      },
      {
        type: 'track',
        artist: 'Artist Name',
        name: 'Wrong Title' // track name shouldn't match
      },
      matchingResult // second match
    ];
    const tracks = searchResults.filter(matcher);
    expect(tracks).toEqual([matchingResult, matchingResult]);
  });
});
