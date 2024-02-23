import { BandcampPlugin } from '.';
import { Bandcamp } from '../../rest';
import { BandcampSearchResult } from '../../rest/Bandcamp';
import fn = jest.fn;
import spyOn = jest.spyOn;

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
    const searchTerm = 'Search term for Bandcamp';
    // some of the search result attributes are irrelevant for this test case
    const irrelevantSearchResultAttributes = {
      url: 'not relevant for this test',
      imageUrl: 'not relevant for this test',
      tags: []
    };
    const bandcampSearch = spyOn(Bandcamp, 'search');

    beforeEach(() => {
      spyOn(plugin, 'createSearchTerm')
        .mockImplementation(fn(() => searchTerm));
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
        ...irrelevantSearchResultAttributes
      };
      bandcampSearch.mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([matchingSearchResult]);

      await expect(plugin.findTrackUrls(streamQuery))
        .resolves.toEqual([matchingSearchResult]);

      expect(bandcampSearch).toHaveBeenCalledTimes(5);
      expect(bandcampSearch).toHaveBeenNthCalledWith(1, searchTerm, 0);
      expect(bandcampSearch).toHaveBeenNthCalledWith(2, searchTerm, 1);
      expect(bandcampSearch).toHaveBeenNthCalledWith(3, searchTerm, 2);
      expect(bandcampSearch).toHaveBeenNthCalledWith(4, searchTerm, 3);
      expect(bandcampSearch).toHaveBeenNthCalledWith(5, searchTerm, 4);
    });

    test('doesn\'t find tracks', async () => {
      bandcampSearch.mockResolvedValue([]);

      await expect(plugin.findTrackUrls(streamQuery))
        .resolves.toEqual([]);

      expect(bandcampSearch).toHaveBeenCalledTimes(5);
    });
  });

  test('creates search term', () => {
    const streamQuery = {
      artist: 'Artist Name',
      track: 'Track Name'
    };
    const searchTerm = plugin.createSearchTerm(streamQuery);
    expect(searchTerm).toBe('Artist Name Track Name');
  });

  test('creates track matcher', () => {
    // some of the search result attributes are irrelevant for this test case
    const irrelevantSearchResultAttributes = {
      url: 'irrelevant for this test',
      imageUrl: 'irrelevant for this test',
      tags: []
    };
    const normalizeForMatching = spyOn(plugin, 'normalizeForMatching');
    normalizeForMatching.mockImplementation(term => term);
    const streamQuery = {
      artist: 'Artist Name',
      track: 'Track Name',
      ...irrelevantSearchResultAttributes
    };
    const matcher = plugin.createTrackMatcher(streamQuery);
    const matchingResult: BandcampSearchResult = {
      type: 'track',
      artist: 'Artist Name',
      name: 'Track Name',
      ...irrelevantSearchResultAttributes
    };
    const searchResults: BandcampSearchResult[] = [
      matchingResult, // first match
      {
        type: 'album', // the 'album' type shouldn't match
        artist: 'irrelevant for this entry',
        name: 'irrelevant for this entry',
        ...irrelevantSearchResultAttributes
      },
      {
        type: 'artist', // the 'artist' type shouldn't match
        artist: 'irrelevant for this entry',
        name: 'irrelevant for this entry',
        ...irrelevantSearchResultAttributes
      },
      {
        type: 'track',
        artist: 'Wrong Artist', // artist shouldn't match
        name: 'irrelevant for this entry',
        ...irrelevantSearchResultAttributes
      },
      {
        type: 'track',
        artist: 'Artist Name',
        name: 'Wrong Title', // track name shouldn't match
        ...irrelevantSearchResultAttributes
      },
      matchingResult // second match
    ];
    const tracks = searchResults.filter(matcher);
    expect(tracks).toEqual([matchingResult, matchingResult]);
  });

  test('normalizeForMatching trims and converts the term to lowercase', () => {
    // mixed case search term padded with spaces
    const termToNormalize = '   Search Term   ';
    const normalizedTerm = plugin.normalizeForMatching(termToNormalize);
    expect(normalizedTerm).toEqual('search term');
  });
});
