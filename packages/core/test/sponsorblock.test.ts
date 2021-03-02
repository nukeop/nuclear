import test from 'ava';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';
import { MockServer, VIDEO_ID } from '../../../__mocks__/sponsor-block-server';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);
mock('MockServer', MockServer);
mock('VIDEO_ID', VIDEO_ID);

import { rest } from '../src';

test('has empty result', async (t) => {
  const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_NO_SEGMENT));
  t.true(segments.length === 0);
});

test('has result', async (t) => {
  const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_SEGMENT));
  t.true(segments instanceof Array);
  t.true(segments.length > 0);
});

test('result is ascendingly ordered by startTime', async (t) => {
  const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_SEGMENT_NOT_ORDER));
  t.true(segments instanceof Array);
  t.true(segments.every(
    (segment, i, arr) => !i || (segment.startTime > arr[i-1].startTime)));
});

test('result has no segment contained in other segment ', async (t) => {
  const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_SEGMENT_CONTAIN_OTHER_SEGMENT));
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
