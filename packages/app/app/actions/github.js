import {
  GITHUB_OAUTH_ACCESS_TOKEN_URL,
  GITHUB_API_USER_ENDPOINT
} from '../rest/Github';

import {
  githubClientId,
  githubSecret
} from '../globals';

export const GITHUB_OAUTH_CODE_SUCCESS = 'GITHUB_OAUTH_CODE_SUCCESS';
export const GITHUB_OAUTH_ACCESS_TOKEN_SUCCESS = 'GITHUB_OAUTH_ACCESS_TOKEN_SUCCESS';
export const GITHUB_LOG_OUT = 'GITHUB_LOG_OUT';

export const GITHUB_GET_USER_START = 'GITHUB_GET_USER_START';
export const GITHUB_GET_USER_SUCCESS = 'GITHUB_GET_USER_SUCCESS';
export const GITHUB_GET_USER_ERROR = 'GITHUB_GET_USER_ERROR';

function githubOauthCodeSuccess(code) {
  return {
    type: GITHUB_OAUTH_CODE_SUCCESS,
    payload: { code }
  };
}

function githubOauthAccessTokenSuccess(accessToken) {
  return {
    type: GITHUB_OAUTH_ACCESS_TOKEN_SUCCESS,
    payload: { accessToken }
  };
}

export function githubOauth(code) {
  return dispatch => {
    dispatch(githubOauthCodeSuccess(code));
    fetch(
      'https://cors-anywhere.herokuapp.com/' +
      GITHUB_OAUTH_ACCESS_TOKEN_URL +
        '?client_id=' +
        githubClientId +
        '&client_secret=' +
        githubSecret +
        '&code=' +
        code,
      {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      }
    )
      .then(response => response.json())
      .then(data => {
        dispatch(githubOauthAccessTokenSuccess(data.access_token));
        dispatch(githubGetUser(data.access_token));
      });
  };
}

export function githubLogOut() {
  return {
    type: GITHUB_LOG_OUT
  };
}

function githubGetUserStart() {
  return {
    type: GITHUB_GET_USER_START
  };
}

function githubGetUserSuccess(data) {
  return {
    type: GITHUB_GET_USER_SUCCESS,
    payload: { data }
  };
}

function githubGetUserError(error) {
  return {
    type: GITHUB_GET_USER_ERROR,
    payload: { error }
  };
}

export function githubGetUser(token) {
  return dispatch => {
    dispatch(githubGetUserStart());
    fetch(GITHUB_API_USER_ENDPOINT, {
      headers: { 'Authorization': `token ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        dispatch(githubGetUserSuccess(data));
      })
      .catch(error => {
        dispatch(githubGetUserError(error));
      });
  };
}
