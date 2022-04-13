import { createStandardAction } from 'typesafe-actions';
import { Connectivity } from './actionTypes';

export const changeConnectivity = createStandardAction(Connectivity.CHANGE_CONNECTIVITY)<boolean>();
