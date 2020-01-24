import NB from 'nodebrainz';
import CoverArtArchive from './CoverArtArchive';
const nb = new NB({userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0'});

function artistSearch(terms) {
  return new Promise((fulfill, reject) => {
    nb.search('artist', {artist: terms}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        fulfill(response);
      }
    });
  });
}

function addCoversToReleases(searchResults) {
  let coverPromises = searchResults['release-groups'].map(group => {
    return CoverArtArchive.releaseGroupFront(group);
  });

  return Promise.all(coverPromises);
}

function getCoverForRelease(releaseId) {
  return CoverArtArchive.getCoverForRelease(releaseId);
}

function releaseSearch(terms) {
  let nbSearch = new Promise((fulfill, reject) => {
    nb.search('release-group', {release: terms}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        fulfill(response);
      }
    });
  });

  return nbSearch;
}

function trackSearch(terms) {
  return new Promise((fulfill, reject) => {
    nb.search('work', {work: terms}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        fulfill(response);
      }
    });
  });
}

export {
  artistSearch,
  releaseSearch,
  trackSearch,
  addCoversToReleases,
  getCoverForRelease
};
