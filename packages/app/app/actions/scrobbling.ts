import electron from 'electron';
import { store } from '@nuclear/core';
import { rest } from '@nuclear/core';

import { Scrobbling } from './actionTypes';
import globals from '../globals';
import { ScrobblingState } from '../reducers/scrobbling';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export function lastFmReadSettings() {
  return dispatch => {
    const settings = (store.get('lastFm') as ScrobblingState);
    if (settings) {
      dispatch({
        type: Scrobbling.LASTFM_READ_SETTINGS,
        payload: {
          lastFmName: settings.lastFmName,
          lastFmAuthToken: settings.lastFmAuthToken,
          lastFmSessionKey: settings.lastFmSessionKey,
          lastFmScrobblingEnabled: settings.lastFmScrobblingEnabled
        }
      });
    } else {
      dispatch({
        type: Scrobbling.LASTFM_READ_SETTINGS,
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
        const authToken = response.token;
        electron.shell.openExternal(
          'https://www.last.fm/api/auth/?api_key=' + globals.lastfmApiKey + '&token=' + authToken
        );

        store.set('lastFm.lastFmAuthToken', authToken);

        dispatch({
          type: Scrobbling.LASTFM_CONNECT,
          payload: authToken
        });
      });
  };
}

export function lastFmLoginAction(authToken: string) {
  return dispatch => {
    dispatch({
      type: 'FAV_IMPORT_INIT',
      payload: {
        lastFmFavImportStatus: true,
        lastFmFavImportMessage: ''
      }
    });
    lastfm.lastFmLogin(authToken)
      .then(response => response.json())
      .then(response => {

        const sessionKey = response.session.key;
        const sessionName = response.session.name;
        store.set('lastFm.lastFmName', sessionName);
        store.set('lastFm.lastFmSessionKey', sessionKey);
        
        dispatch({
          type: Scrobbling.LASTFM_LOGIN,
          payload: {
            sessionKey,
            name: sessionName
          }
        });
      });
  };
}

export function lastFmLogOut() {
  return {
    type: Scrobbling.LASTFM_LOGOUT
  };
}

export function enableScrobbling() {
  store.set('lastFm.lastFmScrobblingEnabled', true);

  return {
    type: Scrobbling.LASTFM_ENABLE_SCROBBLING,
    payload: null
  };
}

export function disableScrobbling() {
  store.set('lastFm.lastFmScrobblingEnabled', false);

  return {
    type: Scrobbling.LASTFM_DISABLE_SCROBBLING,
    payload: null
  };
}

export function scrobbleAction(artist, track, session) {
  return dispatch => {
    lastfm.scrobble(artist, track, session)
      .then(() => {
        dispatch({
          type: Scrobbling.LASTFM_SCROBBLE,
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
          type: Scrobbling.LASTFM_UPDATE_NOW_PLAYING,
          payload: null
        });
      });
  };
}
