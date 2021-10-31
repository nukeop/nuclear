import { createAsyncAction } from 'typesafe-actions';
import {
  SignInResponseBody,
  SignUpResponseBody
} from '@nuclear/core/src/rest/Nuclear/Identity.types';
import { ErrorBody } from '@nuclear/core/src/rest/Nuclear/types';

import { NuclearIdentity } from '../actionTypes';

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
