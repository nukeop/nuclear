import electron from 'electron';
import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getAccessToken, registerNuclear } from '@nuclear/core/src/rest/Mastodon';

import { Mastodon } from './actionTypes';
import { setStringOption } from './settings';

export type RegisterSuccessPayload = {
  id: string;
  name: string;
  website: string | null;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
  url: string | null;
  session_token: string | null;
  instanceUrl: string;
}

export type GetAccessTokenPayload = {
  access_token: string;
  token_type: string;
  created_at: number;
  expires_in: number | null;
  refresh_token: string | null;
  _scope: string;
};

export const registerNuclearAction = createAsyncAction(
  Mastodon.MASTODON_REGISTER_NUCLEAR_START,
  Mastodon.MASTODON_REGISTER_NUCLEAR_SUCCESS,
  Mastodon.MASTODON_REGISTER_NUCLEAR_ERROR
)<undefined, RegisterSuccessPayload, { error: string }>();

export const registerNuclearThunk = (instanceUrl: string): ThunkAction<
  void,
  unknown,
  unknown,
  AnyAction
> => async dispatch => {
  dispatch(registerNuclearAction.request());

  try {
    const appData = await registerNuclear(instanceUrl);
    dispatch(registerNuclearAction.success({
      ...appData,
      instanceUrl
    }));

    electron.shell.openExternal(appData.url);
  } catch (error) {
    dispatch(registerNuclearAction.failure({error}));
  }
};

export const getAccessTokenAction = createAsyncAction(
  Mastodon.MASTODON_GET_ACCESS_TOKEN_START,
  Mastodon.MASTODON_GET_ACCESS_TOKEN_SUCCESS,
  Mastodon.MASTODON_GET_ACCESS_TOKEN_ERROR
)<undefined, GetAccessTokenPayload, { error: string }>();

export const getAccessTokenThunk = (instanceUrl: string, clientId: string, clientSecret: string, authorizationCode: string) => async (dispatch) => {
  dispatch(getAccessTokenAction.request());

  try {
    const tokenData = await getAccessToken(instanceUrl, clientId, clientSecret, authorizationCode);
    dispatch(setStringOption('mastodonAccessToken', tokenData.accessToken, false));
    dispatch(getAccessTokenAction.success(tokenData));
  } catch (error) {
    dispatch(getAccessTokenAction.failure({error}));
  }
};

export const logOutAction = createStandardAction(Mastodon.MASTODON_LOG_OUT)();

export const logOutThunk = () => dispatch => {
  dispatch(logOutAction());
  dispatch(setStringOption('mastodonInstance', undefined, false));
  dispatch(setStringOption('mastodonAuthorizationCode', undefined, false));
  dispatch(setStringOption('mastodonAccessToken', undefined, false));
};
