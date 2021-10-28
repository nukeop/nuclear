import { createAsyncAction } from 'typesafe-actions';
import {
  SignInResponseBody,
  SignUpRequestBody,
  SignUpResponseBody
} from '@nuclear/core/src/rest/Nuclear/Identity.types';
import { ErrorBody } from '@nuclear/core/src/rest/Nuclear/types';

import { NuclearIdentity } from '../actionTypes';
import { NuclearIdentityService } from '@nuclear/core/src/rest/Nuclear/Identity';

export const signUpAction = createAsyncAction(
  NuclearIdentity.SIGN_UP_START,
  NuclearIdentity.SIGN_UP_SUCCESS,
  NuclearIdentity.SIGN_UP_ERROR
)<undefined, SignUpResponseBody, ErrorBody>();

export const signInAction = createAsyncAction(
  NuclearIdentity.SIGN_IN_START,
  NuclearIdentity.SIGN_IN_SUCCESS,
  NuclearIdentity.SIGN_IN_ERROR
)<undefined, SignInResponseBody, ErrorBody>();

export const signUp = (identityServiceUrl: string, body: SignUpRequestBody) => async (dispatch) => {
  dispatch(signUpAction.request());

  try {
    const service = new NuclearIdentityService(identityServiceUrl);
    const result = await service.signUp(body);
    if (result.ok) {
      dispatch(signUpAction.success(result.body));
    } else {
      dispatch(signUpAction.failure(result.body as ErrorBody));
    }
    dispatch(signUpAction);
  } catch (e) {
    dispatch(signUpAction.failure(e));
  }
};
