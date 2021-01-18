/*
eslint-disable
*/
import 'isomorphic-fetch';
import test from 'ava';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);

import { Bandcamp } from '../src/rest';

test('search', async t => {
  const result = await Bandcamp.search('swans')
  t.true(result.length > 0)
});

test('get album info', async t => {
  const result = await Bandcamp.getAlbumInfo('https://swans.bandcamp.com/album/the-seer')
  t.true(result.tracks.length === 11);
  t.is(result.artist, 'SWANS')
  t.is(result.title, 'The Seer')
  t.is(result.imageUrl, 'https://f4.bcbits.com/img/a3233794906_2.jpg')
  t.is(result.url, 'https://swans.bandcamp.com/album/the-seer')
})

test('get track stream', async t => {
  const { duration, stream } = await Bandcamp.getTrackData('https://swans.bandcamp.com/track/apostate');
  t.true(stream.length > 0);
  t.true(stream.includes('https'));
  t.true(stream.includes('stream'));
  t.true(stream.includes('mp3-128'));
  t.true(duration > 0);
})