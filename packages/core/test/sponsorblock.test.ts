import test from 'ava';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);

import { rest } from '../src';

test('has empty result', async (t) => {
  const videoID = 'Ri7-vnrJD3k';
  const segments = await rest.SponsorBlock.getSegments(videoID);
  t.true(segments instanceof Array);
  t.true(segments.length === 0);
});

test('has result', async (t) => {
  const videoID = '6S50AWezyOE';
  const segments = await rest.SponsorBlock.getSegments(videoID);
  t.true(segments instanceof Array);
  t.true(segments.length > 0);
});

test('result is ascendingly ordered by startTime', async (t) => {
  const videoID = 'DX7t6EN8J3Y';
  const segments = await rest.SponsorBlock.getSegments(videoID);
  t.true(segments instanceof Array);
  t.true(segments.every(
    (segment, i, arr) => !i || (segment.startTime > arr[i-1].startTime)));
});

test('result has no segment contained in other segment ', async (t) => {
  const videoID = '26EivpCPHnQ';
  const segments = await rest.SponsorBlock.getSegments(videoID);
  t.true(segments instanceof Array);
  t.true(segments.every(
    (segment, i, arr) => {
      for (let j = 0; j < arr.length; j += 1) {
        if (j === i) {
          continue;
        }
        // check weather this segment is contained in other segment
        //   j------i--------i-----j
        // start  start     end   end
        if (arr[j].startTime <= segment.startTime &&
            arr[j].endTime >= segment.endTime) {
          return false;
        }
      }
      return true;
    }));
});
