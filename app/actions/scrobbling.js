import { store } from '../persistence/store';
import {
  lastFmLoginConnect,
  lastFmLogin
} from '../rest/Lastfm';
import globals from '../globals';
const electron = window.require('electron');

export const LASTFM_CONNECT = 'LASTFM_CONNECT';
export const LASTFM_LOGIN = 'LASTFM_LOGIN';
export const LASTFM_READ_SETTINGS = 'LASTFM_READ_SETTINGS';
export const LASTFM_ENABLE_SCROBBLING = 'LASTFM_ENABLE_SCROBBLING';
export const LASTFM_DISABLE_SCROBBLING = 'LASTFM_DISABLE_SCROBBLING';

export function lastFmReadSettings() {
  return dispatch => {
    let settings = store.get('lastFm').value();
    if (settings) {
        dispatch({
          type: LASTFM_READ_SETTINGS,
          payload: {
            lastFmName: settings.name,
            lastFmSessionKey: settings.sessionKey,
            lastFmScrobblingEnabled: settings.lastFmScrobblingEnabled
          }
        });
    } else {
      dispatch({
        type: LASTFM_READ_SETTINGS,
        payload: null
      });
    }
  }
}

export function lastFmConnectAction() {
  return dispatch => {
    lastFmLoginConnect()
    .then(response => response.json())
    .then(response => {
      let authToken = response.token;
      electron.shell.openExternal(
        'http://www.last.fm/api/auth/?api_key=' + globals.lastfmApiKey + '&token=' + authToken
      );


      store.set('lastFm', lastFm).write();


      dispatch({
        type: LASTFM_CONNECT,
        payload: authToken
      });
    });
  };
}

export function lastFmLoginAction(authToken) {
  return dispatch => {
    lastFmLogin(authToken)
    .then(response => response.json())
    .then(response => {

      let sessionKey = response.session.key;
      let sessionName = response.session.name;

      dispatch({
        type: LASTFM_LOGIN,
        payload: {
          sessionKey: sessionKey,
          name: sessionName
        }
      });
    });
  };
}

export function enableScrobbling() {
  return {
    type: LASTFM_ENABLE_SCROBBLING,
    payload: null
  }
}

export function disableScrobbling() {
  return {
    type: LASTFM_DISABLE_SCROBBLING,
    payload: null
  }
}
