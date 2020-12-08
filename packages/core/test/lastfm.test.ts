import test from 'ava';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);

import { rest } from '../src';

const setupLastFmApi = (key: string, secret: string): rest.LastFmApi => {
  return new rest.LastFmApi(key, secret);
};

test('add api key to url', t => {
  const api = setupLastFmApi('test', 'test');
  const url = 'http://example.com?test=test1&test2=test3';
  const withKey = api.addApiKey(url);

  t.is(withKey, 'http://example.com?test=test1&test2=test3&api_key=test');
});

