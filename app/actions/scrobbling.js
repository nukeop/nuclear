import { lastfmLoginConnect } from '../rest/Lastfm';
import globals from '../globals';
const electron = window.require('electron');

export const LASTFM_CONNECT = 'LASTFM_CONNECT';

export function lastFmConnect() {
  return dispatch => {
    lastfmLoginConnect()
    .then(response => response.json())
    .then(response => {
      let authToken = response.token;
      electron.shell.openExternal(
        'http://www.last.fm/api/auth/?api_key=' + globals.lastfmApiKey + '&token=' + authToken
      );
      console.log(authToken);
    });

    dispatch({
      type: LASTFM_CONNECT,
      payload: null
    });
  };
}
