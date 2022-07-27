import logger from 'electron-timber';
import { createAsyncAction } from 'typesafe-actions';

import { rest } from '@nuclear/core';
import { Configuration, Parameters } from '@nuclear/core/src/rest/Nuclear/Configuration';

import { NuclearConfiguration } from '../actionTypes';

export const fetchNuclearConfigurationAction = createAsyncAction(
  NuclearConfiguration.FETCH_NUCLEAR_CONFIG_START,
  NuclearConfiguration.FETCH_NUCLEAR_CONFIG_SUCCESS,
  NuclearConfiguration.FETCH_NUCLEAR_CONFIG_ERROR
)<undefined, Configuration, string>();

export const fetchNuclearParamsAction = createAsyncAction(
  NuclearConfiguration.FETCH_NUCLEAR_PARAMS_START,
  NuclearConfiguration.FETCH_NUCLEAR_PARAMS_SUCCESS,
  NuclearConfiguration.FETCH_NUCLEAR_PARAMS_ERROR
)<undefined, Parameters, string>();

export const fetchNuclearConfiguration = () => async (dispatch) => {
  dispatch(fetchNuclearConfigurationAction.request());
  try {
    const service = new rest.NuclearConfigurationService(
      process.env.NUCLEAR_SERVICES_URL,
      process.env.NUCLEAR_SERVICES_ANON_KEY
    );
    const config = await service.getConfiguration();
    dispatch(fetchNuclearConfigurationAction.success(config));
  } catch (error) {
    dispatch(fetchNuclearConfigurationAction.failure(error.message));
    logger.error(error);
  }
};

export const fetchNuclearParams = () => async (dispatch) => {
  dispatch(fetchNuclearParamsAction.request());
  try {
    const service = new rest.NuclearConfigurationService(
      process.env.NUCLEAR_SERVICES_URL,
      process.env.NUCLEAR_SERVICES_ANON_KEY
    );
    const params = await service.getParams();
    dispatch(fetchNuclearParamsAction.success(params));
  } catch (error) {
    dispatch(fetchNuclearParamsAction.failure(error.message));
    logger.error(error);
  }
};
