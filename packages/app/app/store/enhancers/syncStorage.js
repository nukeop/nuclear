import { store as electronStore } from '@nuclear/core';

export default function(paths) {

  return next => (reducer, initialState, enhancer) => {
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
      enhancer = initialState;
      initialState = undefined;
    }

    // let reducerInitialPlusMprisStates, persistedState, finalInitialState;
    let persistedState, finalInitialState;

    try {
      // persistedState = electronStore.getItems(paths);
      // finalInitialState = Object.assign({}, initialState, persistedState);

      // For each store path which uses electron-store persistence for some fields, call/include its getInitialState() below.
      // This allows the for-reducer initial-state (+mpris) data to be merged with the electron-store persisted data.
      /* reducerInitialPlusMprisStates = {
        local: local_getInitialState()
      };*/

      // for each path, read its data as a root-field object, since that's what _.merge expects
      persistedState = electronStore.getItems(paths.map(path => path.split('.')[0]));

      // finalInitialState = _.merge({}, initialState, reducerInitialPlusMprisStates, persistedState);
      finalInitialState = _.merge({}, initialState, persistedState);
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
