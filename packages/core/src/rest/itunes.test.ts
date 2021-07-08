import _ from 'lodash';
import { rest } from '..';

const mockFetch = (data) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        data
      }))
    })
  ) as any;
};

describe('iTunes podcast tests', () => {
  beforeEach(() => {
    _.invoke(fetch, 'resetMocks');
  });

  it('search for podcasts', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.podcastSearch('Programming Throwdown', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search for episodes', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.episodesSearch('Programming Throwdown', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search for a podcast by podcastid', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.getPodcast('427166321')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search for a podcast episodes by podcastid', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.getPodcastEpisodes('427166321', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });
});

describe('iTunes music tests', () => {
  beforeEach(() => {
    _.invoke(fetch, 'resetMocks');
  });

  it('search for artists', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.artistSearch('Queen', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search for albums', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.albumSearch('Live at Wembley Stadium', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search for music', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.musicSearch('We Will Rock You', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search an artist details by artistid', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.artistDetailsSearch('3296287', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search an artist albums by artistid', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.artistAlbumsSearch('3296287')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search an album songs by albumid', async () => {
    mockFetch('test');
    mockFetch([{ test: 'test data' }]);
    const json = await (await rest.iTunes.albumSongsSearch('1440806041', '1')).json();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(json.data).toEqual([{ test: 'test data'}]);
  });
});
