const lastfm = require('../rest/Lastfm');

export const LOAD_TAG_INFO_START = 'LOAD_TAG_INFO_START';
export const LOAD_TAG_INFO_SUCCESS = 'LOAD_TAG_INFO_SUCCESS';
export const LOAD_TAG_INFO_ERROR = 'LOAD_TAG_INFO_ERROR';

export function loadTagInfoStart(tag) {
  return {
    type: LOAD_TAG_INFO_START,
    payload: tag
  };
}

export function loadTagInfoSuccess(tag, data) {
  return {
    type: LOAD_TAG_INFO_SUCCESS,
    payload: {
      tag,
      data
    }
  };
}

export function loadTagInfoError(tag) {
  return {
    type: LOAD_TAG_INFO_ERROR,
    payload: tag
  };
}

export function loadTagInfo(tag) {
  return dispatch => {
    dispatch(loadTagInfoStart(tag));
    
    Promise.all([
      lastfm.getTagInfo(tag),
      lastfm.getTagTracks(tag),
      lastfm.getTagAlbums(tag),
      lastfm.getTagArtists(tag)
    ])
      .then(results => Promise.all(results.map(r => r.json())))
      .then(results => {
	dispatch(loadTagInfoSuccess(tag, results));
      })
      .catch(error => {
	console.error(error);
	dispatch(loadTagInfoError(error));
      });
  };
}
