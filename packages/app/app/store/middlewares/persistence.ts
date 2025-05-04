import { Middleware } from '@reduxjs/toolkit';
import _ from 'lodash';
import { store as electronStore, logger } from '@nuclear/core';
import { RootStateRTK } from '../storeTypes';

const pathsToPersist = [
  'downloads',
  'local.expandedFolders',
  'plugin.selected',
  'nuclear.identity'
];

let storeCache: Partial<RootStateRTK> = {};

export const getPersistedState = (): Partial<RootStateRTK> => {
  const preloadedState: Partial<RootStateRTK> = {};
  try {
    for (const path of pathsToPersist) {
      const persistedValue = electronStore.get(path);
      if (persistedValue !== undefined) {
        _.set(preloadedState, path, persistedValue);
      }
    }
    logger.log('Successfully loaded persisted state for RTK store.');
  } catch (e) {
    logger.warn(
      'Failed to retrieve initial state from electron store for RTK:',
      e
    );
  }
  return preloadedState;
};

export const persistenceMiddleware: Middleware<{}, RootStateRTK> = store => next => action => {
  const result = next(action);

  const newState = store.getState();

  try {
    let hasChanged = false;
    const updatedCache = { ...storeCache };

    for (const path of pathsToPersist) {
      const currentStateAtPath = _.get(newState, path);
      const previousStateAtPath = _.get(storeCache, path);

      if (!_.isEqual(currentStateAtPath, previousStateAtPath)) {
        electronStore.set(path, currentStateAtPath);
        _.set(updatedCache, path, _.cloneDeep(currentStateAtPath));
        hasChanged = true;
        logger.log(`Persisted state for path: ${path}`);
      }
    }

    if (hasChanged) {
      storeCache = updatedCache;
    }
  } catch (e) {
    logger.warn('Unable to persist state to electron store:', e);
  }

  return result;
};

export const initializePersistenceCache = (state: RootStateRTK) => {
  try {
    const initialCache: Partial<RootStateRTK> = {};
    for (const path of pathsToPersist) {
      const persistedValue = electronStore.get(path);
      if (persistedValue !== undefined) {
        _.set(initialCache, path, persistedValue);
      } else {
        _.set(initialCache, path, _.get(state, path));
      }
    }
    storeCache = initialCache;
    logger.log('Persistence cache initialized.');
  } catch (e) {
    logger.warn('Failed to initialize persistence cache from electron store:', e);
    storeCache = _.pick(state, pathsToPersist);
  }
};
