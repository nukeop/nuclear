import NB from 'nodebrainz';
import CoverArtArchive from './CoverArtArchive';
import { CoverArtArchiveResult } from './CoverArtArchive';
const nb = new NB({ userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0' });

const artistSearch = (terms: string): Promise<MusicbrainzArtistResponse> =>
  new Promise((fulfill, reject) => {
    nb.search('artist', { artist: terms }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        fulfill(response);
      }
    });
  });


const releaseSearch = (terms: string): Promise<MusicbrainzReleaseResponse> =>
  new Promise((fulfill, reject) => {
    nb.search('release-group', { release: terms }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        fulfill(response);
      }
    });
  });

const trackSearch = (terms: string): Promise<MusicbrainzTrackResponse> =>
  new Promise((fulfill, reject) => {
    nb.search('work', { work: terms }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        fulfill(response);
      }
    });
  });

const getCoverForRelease = (releaseId: string): Promise<CoverArtArchiveResult> =>
  CoverArtArchive.getCoverForRelease(releaseId);


export {
  artistSearch,
  releaseSearch,
  trackSearch,
  getCoverForRelease
};
