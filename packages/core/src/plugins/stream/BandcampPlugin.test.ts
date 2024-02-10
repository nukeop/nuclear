import {BandcampPlugin} from '.';
import {Bandcamp} from '../../rest';
import spyOn = jest.spyOn;
import {BandcampSearchResult} from '../../rest/Bandcamp';

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
    const trackQuery = 'Track Name';
    const bandcampSearch = spyOn(Bandcamp, 'search');

    afterEach(() => {
      bandcampSearch.mockReset();
    });

    test('finds track', async () => {
      const matchingSearchResult: BandcampSearchResult = {
        type: 'track',
        artist: 'Artist Name',
        name: 'Track Name',
        url: null,
        imageUrl: null,
        tags: null
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
});
