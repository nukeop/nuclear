import { UserAccountState } from '@nuclear/core/src/rest/Nuclear/Identity.types';
import produce from 'immer';
import { pick } from 'lodash';
import { ActionType, createReducer } from 'typesafe-actions';
import { NuclearIdentity } from '../../actions/actionTypes';

import * as actions from '../../actions/nuclear/identity';

export class IdentityStore {
    signedUpUser: {
        id: string;
        username: string;
        displayName: string;
        accountState: UserAccountState;
    }
}

const defaultState = { ...new IdentityStore() };

export type IdentityAction = ActionType<typeof actions>;

export const reducer = createReducer<IdentityStore, IdentityAction>(
  defaultState,
  {
    [NuclearIdentity.SIGN_UP_SUCCESS]: (state, action) => produce(state, (draft) => {
      draft.signedUpUser = pick(action.payload, ['id', 'username', 'displayName', 'accountState']);
    })
  }
);
