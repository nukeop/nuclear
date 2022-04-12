import fetchMock from 'fetch-mock';

import { rest } from '..';

const setupLastFmApi = (key: string, secret: string): rest.LastFmApi => {
  return new rest.LastFmApi(key, secret);
};

describe('Last.fm tests', () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  it('add api key to url', () => {
    const api = setupLastFmApi('test', 'test');
    const url = 'http://example.com?test=test1&test2=test3';
    const withKey = api.addApiKey(url);

    expect(withKey).toBe('http://example.com?test=test1&test2=test3&api_key=test');
  });

  it('signs url', () => {
    const api = setupLastFmApi('test', 'test');
    const url = 'http://example.com?test=test1&test2=test3';
    const signed = api.sign(url);

    expect(signed).toBe('4dd7efc68ff9d7c293ac0f71eb133ace');
  });

  it('prepares url', () => {
    const api = setupLastFmApi('test', 'test');
    const url = 'http://example.com?test=test1&test2=test3';
    const prepared = api.prepareUrl(url);

    expect(prepared).toBe('http://example.com?test=test1&test2=test3&api_key=test&api_sig=cd28b8fd248073c89aad9b77dd069567');
  });

  it('gets top tracks', async () => {
    const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
      '2ee49e35f08b837d43b2824198171fc8');

    const apiResponse = {
      'toptracks': {}
    };

    fetchMock.get('https://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&format=json&api_key=2b75dcb291e2b0c9a2c994aca522ac14', apiResponse);

    const response = await api.getTopTracks();
    const data = await response.json();

    expect(data).toEqual(apiResponse);
  });

  it('searches tracks', async () => {
    const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
      '2ee49e35f08b837d43b2824198171fc8');

    const apiResponse = {
      'search': {}
    };
  
    fetchMock.get('https://ws.audioscrobbler.com/2.0/?method=track.search&format=json&track=billie%20jean&limit=30&api_key=2b75dcb291e2b0c9a2c994aca522ac14', apiResponse);

    const response = await api.searchTracks('billie jean');
    const data = await response.json();

    expect(data).toEqual(apiResponse);
  });

  it('gets the number of user\'s favorite tracks', async () => {
    const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
      '2ee49e35f08b837d43b2824198171fc8');
    const testUser = 'nuclear';

    const apiResponse = {
      lovedtracks: {
        '@attr': {
          total: '100'
        }
      }
    };

    fetchMock.post('https://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=nuclear&format=json&limit=1&page=1&api_key=2b75dcb291e2b0c9a2c994aca522ac14', apiResponse);
  
    const response = await api.getLovedTracks(testUser, 1, 1);
    const data = await response.json();

    expect(data).toEqual(apiResponse);
  });
});
