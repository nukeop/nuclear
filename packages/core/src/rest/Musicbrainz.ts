import NB from 'nodebrainz';
import CoverArtArchive from './CoverArtArchive';
import { CoverArtArchiveResult } from './CoverArtArchive';
import {
  MusicbrainzArtistResponse,
  MusicbrainzReleaseGroupResponse,
  MusicbrainzTrackResponse,
  MusicbrainzArtist,
  MusicbrainzReleaseGroup,
  MusicbrainzRelease
} from './Musicbrainz.types';

const nb = new NB({ userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0' });

const artistSearch = (terms: string): Promise<MusicbrainzArtistResponse> =>
  new Promise((resolve, reject) => {
    nb.search('artist', { artist: terms }, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

const releaseSearch = (terms: string): Promise<MusicbrainzReleaseGroupResponse> =>
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

const getCoverForReleaseGroup = (releaseGroupId: string): Promise<CoverArtArchiveResult> =>
  CoverArtArchive.getCoverForReleaseGroup(releaseGroupId);

const getCoverForRelease = (releaseId: string): Promise<CoverArtArchiveResult> =>
  CoverArtArchive.getCoverForRelease(releaseId);

const getArtist = (id: string): Promise<MusicbrainzArtist> =>
  new Promise((resolve, reject) => {
    nb.artist(id, {}, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

const getArtistReleases = (id: string): Promise<MusicbrainzArtist> =>
  new Promise((resolve, reject) => {
    nb.artist(id, { inc: 'releases+release-groups' }, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

const getReleaseGroupDetails = (releaseGroupId: string): Promise<MusicbrainzReleaseGroup> =>
  new Promise((resolve, reject) => {
    nb.releaseGroup(releaseGroupId, { inc: 'releases' }, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

const getReleaseDetails = (releaseId: string): Promise<MusicbrainzRelease> =>
  new Promise((resolve, reject) => {
    nb.release(releaseId, { inc: 'artists+recordings+genres' }, (err, response) => {
      err ? reject(err) : resolve(response);
    });
  });

export {
  artistSearch,
  releaseSearch,
  trackSearch,
  getCoverForReleaseGroup,
  getCoverForRelease,
  getArtist,
  getArtistReleases,
  getReleaseGroupDetails,
  getReleaseDetails
};
