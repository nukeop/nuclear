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
  // const videoID = 'no-a-real-videoid';
  // const segments = await rest.SponsorBlock.getSegments(videoID);
  // const originalResponseFromAPI = [
  //   {
  //     "category":"sponsor",
  //     "segment":[0.300312,17.486291],
  //     "UUID":"8e4d2c8cfcd9d7647759a765a634777d1d20abca6758d0432556717a048ca8e2"
  //   },
  //   {
  //     "category":"sponsor",
  //     "segment":[962.72917,1022.340966],"UUID":"e3d03b97947b2932e652edc366f83d2f8ca54682d240e31142717f54474cbea5"
  //   },
  //   {
  //     "category":"selfpromo",
  //     "segment":[10.658109,16.966255],
  //     "UUID":"f06dc54e385d6a0ea986abfa6b94f1f0ecd794ea99450a1bd69ec820e2551979"
  //   },
  //   {
  //     "category":"outro",
  //     "segment":[1025.782768,1042.761723],"UUID":"d3ae9c79bebf3b994e1999292c656d713ffccb5adf5c1da11e6e606ad15a5822"
  //   }
  // ];

  // const formatedResponse = [
  //   {
  //     "category":"sponsor",
  //     "segment":[0.300312,17.486291]
  //   },
  //   {
  //     "category":"sponsor",
  //     "segment":[962.72917,1022.340966]
  //   },
  //   {
  //     "category":"outro",
  //     "segment":[1025.782768,1042.761723]
  //   }
  // ]
  
  t.true([].length === 0);
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
