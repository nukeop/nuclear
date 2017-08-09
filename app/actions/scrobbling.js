import {
  lastFmLoginConnect,
  lastFmLogin
} from '../rest/Lastfm';
import globals from '../globals';
const electron = window.require('electron');

export const LASTFM_CONNECT = 'LASTFM_CONNECT';
export const LASTFM_LOGIN = 'LASTFM_LOGIN';

export function lastFmConnectAction() {
  return dispatch => {
    lastFmLoginConnect()
    .then(response => response.json())
    .then(response => {
      let authToken = response.token;
      electron.shell.openExternal(
        'http://www.last.fm/api/auth/?api_key=' + globals.lastfmApiKey + '&token=' + authToken
      );

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
