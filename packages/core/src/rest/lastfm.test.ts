import { rest } from '..';

const setupLastFmApi = (key: string, secret: string): rest.LastFmApi => {
  return new rest.LastFmApi(key, secret);
};

describe('Last.fm tests', () => {
  it('add api key to url', () => {
    const api = setupLastFmApi('test', 'test');
    const url = 'http://example.com?test=test1&test2=test3';
    const withKey = api.addApiKey(url);

    expect(withKey).toBe('http://example.com?test=test1&test2=test3&api_key=test');
  });

  it('sign url', () => {
    const api = setupLastFmApi('test', 'test');
    const url = 'http://example.com?test=test1&test2=test3';
    const signed = api.sign(url);

    expect(signed).toBe('4dd7efc68ff9d7c293ac0f71eb133ace');
  });

  it('prepare url', () => {
    const api = setupLastFmApi('test', 'test');
    const url = 'http://example.com?test=test1&test2=test3';
    const prepared = api.prepareUrl(url);

    expect(prepared).toBe('http://example.com?test=test1&test2=test3&api_key=test&api_sig=cd28b8fd248073c89aad9b77dd069567');
  });

  it('get top tracks', async () => {
    const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
      '2ee49e35f08b837d43b2824198171fc8');

    const response = await api.getTopTracks();
    const data = await response.json();

    expect(typeof data.tracks).toBe('object');
    expect(data.tracks.track instanceof Array).toBe(true);
  });

  it('search tracks', async () => {
    const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
      '2ee49e35f08b837d43b2824198171fc8');

    const response = await api.searchTracks('billie jean');
    const data = await response.json();

    expect(typeof data.results).toBe('object');
    expect(data.results.trackmatches.track instanceof Array).toBe(true);
    expect(data.results.trackmatches.track.length).toBeGreaterThan(0);
  });
});
