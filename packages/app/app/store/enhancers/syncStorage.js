import { store as electronStore } from '@nuclear/core';

export default function(paths) {

  return next => (reducer, initialState, enhancer) => {
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
      enhancer = initialState;
      initialState = undefined;
    }

    // retrieve initial states from reducers, to apply prior to merging electron-store persisted-data
    const reducerInitialStates = reducer(undefined, {});

    let finalInitialState = _.merge({}, reducerInitialStates, initialState);

    try {
      // for each persisted-path, read its data as a root-field object, since that's what _.merge expects
      const pathRoots = paths.map(path => path.split('.')[0]);
      const persistedState = electronStore.getItems(pathRoots);
      finalInitialState = _.merge({}, finalInitialState, persistedState);
    } catch (e) {
      console.warn(
        'Failed to retrieve initialize state from electron store:',
        e
      );
    }
    const store = next(reducer, finalInitialState, enhancer);
    store.subscribe(() => {
      const state = store.getState();
      const subset = _.pick(state, paths);
      try {
        electronStore.setItems(subset);
      } catch (e) {
        console.warn('Unable to persist state to electron store:', e);
      }
    });

    return store;
  };
}
