import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { Mastodon } from '../actions/actionTypes';
import * as actions from '../actions/mastodon';
import { RegisterSuccessPayload } from '../actions/mastodon';
import { handleLoadableActionError, handleLoadableActionSuccess, loadingStateMeta, startingStateMeta } from './helpers';
import { Loadable } from './types';

export class MastodonStore {
  appData?: Loadable<RegisterSuccessPayload> = { ...startingStateMeta };
  tokenData?: Loadable<actions.GetAccessTokenPayload> = { ...startingStateMeta };
}

const defaultState = { ...new MastodonStore() };

export type MastodonAction = ActionType<typeof actions>;

const appDataKeyCreator = () => 'appData';
const tokenDataKeyCreator = () => 'tokenData';
export const reducer = createReducer<MastodonStore, MastodonAction>(
  defaultState, {
    [Mastodon.MASTODON_REGISTER_NUCLEAR_START]: (state) =>
      produce(state, draft => {
        draft.appData = { ...loadingStateMeta };
      }),
    [Mastodon.MASTODON_REGISTER_NUCLEAR_SUCCESS]: handleLoadableActionSuccess(appDataKeyCreator),
    [Mastodon.MASTODON_REGISTER_NUCLEAR_ERROR]: handleLoadableActionError(appDataKeyCreator),

    [Mastodon.MASTODON_GET_ACCESS_TOKEN_START]: (state) =>
      produce(state, draft => {
        draft.tokenData = { ...loadingStateMeta };
      }),
    [Mastodon.MASTODON_GET_ACCESS_TOKEN_SUCCESS]: handleLoadableActionSuccess(tokenDataKeyCreator),
    [Mastodon.MASTODON_GET_ACCESS_TOKEN_ERROR]: handleLoadableActionError(tokenDataKeyCreator),
    [Mastodon.MASTODON_LOG_OUT]: (state) =>
      produce(state, draft => {
        draft.appData = { ...startingStateMeta };
        draft.tokenData = { ...startingStateMeta };
      })
  });
