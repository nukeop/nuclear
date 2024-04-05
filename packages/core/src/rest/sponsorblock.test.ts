import { rest } from '..';
import { OriginalSegment } from './SponsorBlock.types';

import { MockServer, VIDEO_ID } from '../../test/sponsor-block-server';

describe('Sponsorblock tests', () => {
  it('has empty result', () => {
    const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_NO_SEGMENT) as OriginalSegment[]);
    expect(segments.length).toBe(0);
  });

  it('has result', () => {
    const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_SEGMENT) as OriginalSegment[]);
    expect(segments instanceof Array).toBe(true);
    expect(segments.length).toBeGreaterThan(0);
  });

  it('result is ascendingly ordered by startTime', () => {
    const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_SEGMENT_NOT_ORDER) as OriginalSegment[]);
    expect(segments instanceof Array).toBe(true);
    expect(segments.every(
      (segment, i, arr) => !i || (segment.startTime > arr[i - 1].startTime))).toBe(true);
  });

  it('result has no segment contained in other segment ', () => {
    const segments = rest.SponsorBlock.formatResponse(MockServer.request(VIDEO_ID.HAS_SEGMENT_CONTAIN_OTHER_SEGMENT) as OriginalSegment[]);
    expect(segments instanceof Array).toBe(true);
    expect(segments.every(
      (segment, i, arr) => {
        for (let j = 0; j < arr.length; j += 1) {
          if (j === i) {
            continue;
          }
          // check whether this segment is contained in another segment
          //   j------i--------i-----j
          // start  start     end   end
          if (arr[j].startTime <= segment.startTime &&
            arr[j].endTime >= segment.endTime) {
            return false;
          }
        }
        return true;
      })).toBe(true);
  });
});
