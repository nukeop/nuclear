import { store as electronStore } from '../../persistence/store';

export default function(paths) {

  return next => (reducer, initialState, enhancer) => {
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
      enhancer = initialState;
      initialState = undefined;
    }

    let persistedState, finalInitialState;

    try {
      persistedState = electronStore.getItems(paths);
      finalInitialState = Object.assign({}, initialState, persistedState);
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
