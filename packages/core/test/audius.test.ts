import test from 'ava';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);

import { rest } from '../src';

const hosts = [
  'https://audius-discovery.nz.modulational.com/v1',
  'https://audius-dp.johannesburg.creatorseed.com/v1',
  'https://discoveryprovider.audius4.prod-us-west-2.staked.cloud/v1',
  'https://disc-gru01.audius.hashbeam.com/v1',
  'https://dn-jpn.audius.metadata.fyi/v1',
  'https://audius-discovery-1.altego.net/v1',
  'https://audius-metadata-1.figment.io/v1',
  'https://discoveryprovider.audius1.prod-us-west-2.staked.cloud/v1',
  'https://discoveryprovider.mumbaudius.com/v1',
  'https://discoveryprovider.audius3.prod-us-west-2.staked.cloud/v1',
  'https://discovery-au-01.audius.openplayer.org/v1',
  'https://audius-disco.ams-x01.nl.supercache.org/v1',
  'https://audius-metadata-2.figment.io/v1',
  'https://discoveryprovider.audius5.prod-us-west-2.staked.cloud/v1',
  'https://discoveryprovider.audius2.prod-us-west-2.staked.cloud/v1'
];

test('audius host is selected', async (t) => {
  const endpoint = await rest.Audius._findHost();
  t.true(hosts.includes(endpoint));
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
