import test from 'ava';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);

import { rest } from '../src';


test('audius host is selected', async (t) => {
  const endpoint = await rest.Audius._findHost();
  const gex = /^https:\/\/discoveryprovider[0-9]?/;
  t.true(gex.test(endpoint));
});

test('search artists', async t => {
  const endpoint = await rest.Audius._findHost();
  const response = await rest.Audius.artistSearch(endpoint, 'roto');
  const json = await response.json();
  t.is(typeof json, 'object');
  t.true(json.data instanceof Array);
  t.true(json.data.length > 0);
});

test('search tracks', async t => {
  const endpoint = await rest.Audius._findHost();
  const response = await rest.Audius.trackSearch(endpoint, 'roto');
  const json = await response.json();
  t.is(typeof json, 'object');
  t.true(json.data instanceof Array);
  t.true(json.data.length > 0);
});
