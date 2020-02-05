import NB from 'nodebrainz';
import CoverArtArchive from './CoverArtArchive';
import { CoverArtArchiveResult } from './CoverArtArchive';
import {
  MusicbrainzArtistResponse,
  MusicbrainzReleaseResponse,
  MusicbrainzTrackResponse,
  MusicbrainzArtist
} from './Musicbrainz.types';

const nb = new NB({ userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0' });

const artistSearch = (terms: string): Promise<MusicbrainzArtistResponse> =>
  new Promise((resolve, reject) => {
    nb.search('artist', { artist: terms }, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });


const releaseSearch = (terms: string): Promise<MusicbrainzReleaseResponse> =>
  new Promise((resolve, reject) => {
    nb.search('release-group', { release: terms }, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

const trackSearch = (terms: string): Promise<MusicbrainzTrackResponse> =>
  new Promise((resolve, reject) => {
    nb.search('work', { work: terms }, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

const getCoverForRelease = (releaseId: string): Promise<CoverArtArchiveResult> =>
  CoverArtArchive.getCoverForRelease(releaseId);

const getArtist = (id: string): Promise<MusicbrainzArtist> =>
  new Promise((resolve, reject) => {
    nb.artist(id, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

export {
  artistSearch,
  releaseSearch,
  trackSearch,
  getCoverForRelease,
  getArtist
};
