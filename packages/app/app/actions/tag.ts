import { logger } from '@nuclear/core';
import { rest } from '@nuclear/core';
import globals from '../globals';

export const LOAD_TAG_INFO_START = 'LOAD_TAG_INFO_START';
export const LOAD_TAG_INFO_SUCCESS = 'LOAD_TAG_INFO_SUCCESS';
export const LOAD_TAG_INFO_ERROR = 'LOAD_TAG_INFO_ERROR';
const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export function loadTagInfoStart(tag: string) {
  return {
    type: LOAD_TAG_INFO_START,
    payload: tag
  };
}

export function loadTagInfoSuccess(tag: string, data) {
  return {
    type: LOAD_TAG_INFO_SUCCESS,
    payload: {
      tag,
      data
    }
  };
}

export function loadTagInfoError(tag: string) {
  return {
    type: LOAD_TAG_INFO_ERROR,
    payload: tag
  };
}

export function loadTagInfo(tag: string) {
  return dispatch => {
    dispatch(loadTagInfoStart(tag));

    Promise.all([
      lastfm.getTagInfo(tag),
      lastfm.getTagTracks(tag),
      lastfm.getTagAlbums(tag),
      lastfm.getTagArtists(tag)
    ])
      .then((results) => {
        dispatch(loadTagInfoSuccess(tag, results));
      })
      .catch(error => {
        logger.error(error);
        dispatch(loadTagInfoError(error));
      });
  };
}
