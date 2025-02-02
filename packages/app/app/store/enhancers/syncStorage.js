import _ from 'lodash';
import { logger } from '@nuclear/core';
import { store as electronStore } from '@nuclear/core';

export default function (paths) {

  return next => (reducer, initialState, enhancer) => {
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
      enhancer = initialState;
      initialState = undefined;
    }

    // retrieve initial states from reducers, to apply prior to merging electron-store persisted-data
    const reducerInitialStates = reducer(undefined, {});

    let finalInitialState = _.merge({}, reducerInitialStates, initialState);

    try {
      for (const path of paths) {
        const persistedValue = electronStore.get(path);
        finalInitialState = _.setWith(_.clone(finalInitialState), path, persistedValue, _.clone); // deep, immutable set
      }
    } catch (e) {
      logger.warn(
        'Failed to retrieve initialize state from electron store:',
        e
      );
    }
    
    const storeCache = {};

    const store = next(reducer, finalInitialState, enhancer);
    store.subscribe(() => {
      const state = store.getState();
      try {
        for (const path of paths) {
          const localState = _.get(state, path);
          if (localState && !_.isEqual(_.get(storeCache, path), localState) ) {
            _.set(storeCache, path, localState);
            electronStore.set(path, localState);
          }
        }
      } catch (e) {
        logger.warn('Unable to persist state to electron store:', e);
      }
    });

    return store;
  };
}
