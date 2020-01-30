import { store } from '../persistence/store';
import { LastFmApi } from '@nuclear/core';
import globals from '../globals';
const electron = window.require('electron');
const lastfm = new LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export const LASTFM_CONNECT = 'LASTFM_CONNECT';
export const LASTFM_LOGIN = 'LASTFM_LOGIN';
export const LASTFM_LOGOUT = 'LASTFM_LOGOUT';

export const LASTFM_READ_SETTINGS = 'LASTFM_READ_SETTINGS';
export const LASTFM_ENABLE_SCROBBLING = 'LASTFM_ENABLE_SCROBBLING';
export const LASTFM_DISABLE_SCROBBLING = 'LASTFM_DISABLE_SCROBBLING';

export const LASTFM_SCROBBLE = 'LASTFM_SCROBBLE';
export const LASTFM_UPDATE_NOW_PLAYING = 'LASTFM_UPDATE_NOW_PLAYING';

export const LASTFM_ENABLE_IMPORT = 'LASTFM_ENABLE_IMPORT';
export const LASTFM_DISABLE_IMPORT = 'LASTFM_DISABLE_IMPORT';

export function lastFmReadSettings() {
  return dispatch => {
    let settings = store.get('lastFm') || {};
    if (settings) {
      dispatch({
        type: LASTFM_READ_SETTINGS,
        payload: {
          lastFmName: settings.lastFmName,
          lastFmAuthToken: settings.lastFmAuthToken,
          lastFmSessionKey: settings.lastFmSessionKey,
          lastFmScrobblingEnabled: settings.lastFmScrobblingEnabled,
          lastFmFavImportStatus: settings.lastFmFavImportStatus
        }
      });
    } else {
      dispatch({
        type: LASTFM_READ_SETTINGS,
        payload: null
      });
    }
  };
}

export function lastFmConnectAction() {
  return dispatch => {
    lastfm.lastFmLoginConnect()
      .then(response => response.json())
      .then(response => {
        let authToken = response.token;
        electron.shell.openExternal(
          'https://www.last.fm/api/auth/?api_key=' + globals.lastfmApiKey + '&token=' + authToken
        );

        store.set('lastFm.lastFmAuthToken', authToken);

        dispatch({
          type: LASTFM_CONNECT,
          payload: authToken
        });
      });
  };
}

export function lastFmLoginAction(authToken) {
  return dispatch => {
    lastfm.lastFmLogin(authToken)
      .then(response => response.json())
      .then(response => {

        let sessionKey = response.session.key;
        let sessionName = response.session.name;
        let importStatus = sessionKey ? true : false;
        store.set('lastFm.lastFmName', sessionName);
        store.set('lastFm.lastFmSessionKey', sessionKey);
        store.set('lastFm.lastFmFavImportStatus', importStatus);
        dispatch({
          type: LASTFM_LOGIN,
          payload: {
            sessionKey,
            name: sessionName,
            lastFmFavImportStatus: importStatus
          }
        });
      });
  };
}

export function lastFmLogOut() {
  return {
    type: LASTFM_LOGOUT
  };
}

export function enableScrobbling() {
  store.set('lastFm.lastFmScrobblingEnabled', true);

  return {
    type: LASTFM_ENABLE_SCROBBLING,
    payload: null
  };
}

export function disableScrobbling() {
  store.set('lastFm.lastFmScrobblingEnabled', false);

  return {
    type: LASTFM_DISABLE_SCROBBLING,
    payload: null
  };
}

export function scrobbleAction(artist, track, session) {
  return dispatch => {
    lastfm.scrobble(artist, track, session)
      .then(() => {
        dispatch({
          type: LASTFM_SCROBBLE,
          payload: null
        });
      });
  };
}

export function updateNowPlayingAction(artist, track, session) {
  return dispatch => {
    lastfm.updateNowPlaying(artist, track, session)
      .then(() => {
        dispatch({
          type: LASTFM_UPDATE_NOW_PLAYING,
          payload: null
        });
      });
  };
}

export function FmFavImport(){
  let importStatus = store.get('lastFm.lastFmFavImportStatus');
  if (importStatus){
    store.set('lastFm.lastFmFavImportStatus', false);
    return dispatch => {
      dispatch({
        type: LASTFM_DISABLE_IMPORT,
        payload: null
      });
    };
  } else {
    store.set('lastFm.lastFmFavImportStatus', true);
    return dispatch => {
      dispatch({
        type: LASTFM_ENABLE_IMPORT,
        payload: null
      });
    };
  }
}
