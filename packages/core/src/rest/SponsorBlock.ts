import { VideoID, Category, Segment } from './SponsorBlock.types';
import _ from 'lodash';

const BASE_URL = 'https://sponsor.ajay.app';
export const ALL_CATEGORIES = ['sponsor', 'intro', 'outro', 'interaction', 'selfpromo', 'music_offtopic'];

export async function getSegments (videoID: VideoID, categories?: Category[]): Promise<Segment[]> {
  let query = `?videoID=${videoID}`;

  if (!categories) {
    query += `&categories=${JSON.stringify(ALL_CATEGORIES)}`;
  } else if (categories.length > 1) {
    query += `&categories=${JSON.stringify(categories)}`;
  } else if (categories.length === 1) {
    query += `&category=${categories[0]}`;
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
          let segments = j.map(({category, segment}) => {
            return {startTime: Math.round(segment[0]), endTime: Math.round(segment[1]), category};
          });

          segments = _.sortBy(segments, ['startTime']);
          const temp = _.concat(segments);
          segments = _.filter(_.uniq(segments), (v: Segment) => {
            for (const s of temp) {
              if (s === v) {
                continue;
              }
              if (v.startTime >= s.startTime && v.endTime <= s.endTime) {
                return false;
              }
            }
            return true;
          });

          resolve(segments);
        });
    } catch (error) {
      resolve([]);
    }
  });
}
