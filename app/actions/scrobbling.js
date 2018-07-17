import { store } from '../persistence/store';
import {
  lastFmLoginConnect,
  lastFmLogin,
  scrobble,
  updateNowPlaying
} from '../rest/Lastfm';
import globals from '../globals';
const electron = window.require('electron');

export const LASTFM_CONNECT = 'LASTFM_CONNECT';
export const LASTFM_LOGIN = 'LASTFM_LOGIN';
export const LASTFM_READ_SETTINGS = 'LASTFM_READ_SETTINGS';
export const LASTFM_ENABLE_SCROBBLING = 'LASTFM_ENABLE_SCROBBLING';
export const LASTFM_DISABLE_SCROBBLING = 'LASTFM_DISABLE_SCROBBLING';

export const LASTFM_SCROBBLE = 'LASTFM_SCROBBLE';
export const LASTFM_UPDATE_NOW_PLAYING = 'LASTFM_UPDATE_NOW_PLAYING';

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

        store.set('lastFm', Object.assign(
          {},
          store.get('lastFm'),
          {
            lastFmAuthToken: authToken
          }
        ));

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

        store.set('lastFm', Object.assign(
          {},
          store.get('lastFm'),
          {
            lastFmName: sessionName,
            lastFmSessionKey: sessionKey
          }
        ));

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
  store.set('lastFm', Object.assign(
    {},
    store.get('lastFm'),
    {
      lastFmScrobblingEnabled: true
    }
  ));

  return {
    type: LASTFM_ENABLE_SCROBBLING,
    payload: null
  };
}

export function disableScrobbling() {
  store.set('lastFm', Object.assign(
    {},
    store.get('lastFm'),
    {
      lastFmScrobblingEnabled: false
    }
  ));
  
  return {
    type: LASTFM_DISABLE_SCROBBLING,
    payload: null
  };
}

export function scrobbleAction(artist, track, session) {
  return dispatch => {
    scrobble(artist, track, session)
      .then(response => {
        dispatch({
          type: LASTFM_SCROBBLE,
          payload: null
        });
      });
  }
}

export function updateNowPlayingAction(artist, track, session) {
  return dispatch => {
    updateNowPlaying(artist, track, session)
      .then(response => {
        dispatch({
          type: LASTFM_UPDATE_NOW_PLAYING,
          payload: null
        });
      });
  }
}
