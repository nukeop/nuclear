import { VideoID, Category, Segment, OriginalSegment } from './SponsorBlock.types';
import _ from 'lodash';
import { logger } from '../../';

const BASE_URL = 'https://sponsor.ajay.app';
export const ALL_CATEGORIES = ['sponsor', 'intro', 'outro', 'interaction', 'selfpromo', 'music_offtopic'];

export async function getSegments (videoID: VideoID, categories?: Category[]): Promise<Segment[]> {
  let query = `?videoID=${videoID}`;

  if (!categories) {
    query += `&categories=${JSON.stringify(ALL_CATEGORIES)}`;
  } else if (categories.length) {
    query += `&categories=${JSON.stringify(categories)}`;
  }

  return new Promise((resolve) => {
    try {
      fetch(`${BASE_URL}/api/skipSegments${query}`)
        .then(r => {
          if (r.status !== 200) {
            return resolve([]);
          }
          return r.json();
        })
        .then(j => {
          if (!j) {
            return resolve([]);
          }

          const segments = formatResponse(j);

          resolve(segments);
        });
    } catch (error) {
      logger.error(`An error when getting skipsegment from SponsorBlock, videoID: ${videoID}`);
      logger.error(error);
      return [];
    }
  });
}

function formatResponse(jsonRes: OriginalSegment[]): Segment[] {
  let segments = jsonRes.map(({category, segment}) => {
    return {
      category,
      startTime: Math.round(segment[0]), 
      endTime: Math.round(segment[1])
    };
  });

  segments = _.sortBy(segments, ['startTime']);
  segments = _.filter(segments, (v: Segment) => {
    for (const s of segments) {
      if (s === v) {
        continue;
      }
      if (v.startTime >= s.startTime && v.endTime <= s.endTime) {
        return false;
      }
    }
    return true;
  });

  return segments;
}
export { formatResponse };
