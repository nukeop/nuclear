import lib from '../lib';
import test from 'ava';

const LastFmApi = lib.LastFmApi;

const setupLastFmApi = (key, secret) => {
  return new LastFmApi(key, secret);
};

test('add api key to url', t => {
  let api = setupLastFmApi('test', 'test');
  let url = 'http://example.com?test=test1&test2=test3';
  let withKey = api.addApiKey(url);

  t.is(withKey, 'http://example.com?test=test1&test2=test3&api_key=test');
});

test('sign url', t => {
  let api = setupLastFmApi('test', 'test');
  let url = 'http://example.com?test=test1&test2=test3';
  let signed = api.sign(url);

  t.is(signed, '4dd7efc68ff9d7c293ac0f71eb133ace');
});

test('prepare url', t => {
  let api = setupLastFmApi('test', 'test');
  let url = 'http://example.com?test=test1&test2=test3';
  let prepared = api.prepareUrl(url);

  t.is(prepared, 'http://example.com?test=test1&test2=test3&api_key=test&api_sig=cd28b8fd248073c89aad9b77dd069567');
});

test('get top tracks', async t => {
  let api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');
  
  let data = await api.getTopTracks();
  data = await data.json();

  t.is(typeof data.tracks, 'object');
  t.true(data.tracks.track instanceof Array);
});

test('search tracks', async t => {
  let api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  let data = await api.searchTracks('billie jean');
  data = await data.json();

  t.is(typeof data.results, 'object');
  t.true(data.results.trackmatches.track instanceof Array);
  t.true(data.results.trackmatches.track.length > 0);
});

test('get similar tracks', async t => {
  let api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  let data = await api.searchTracks('michael jackson', 'billie jean');
  data = await data.json();

  t.is(typeof data.results, 'object');
  t.true(data.results.trackmatches.track instanceof Array);
  t.true(data.results.trackmatches.track.length > 0);
});
