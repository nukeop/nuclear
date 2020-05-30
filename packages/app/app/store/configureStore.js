import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';

import rootReducer from '../reducers';
import syncStore from './enhancers/syncStorage';
import ipcConnect from './middlewares/ipc';

export default function configureStore(initialState) {
  const composeEnhancers = process.env.NODE_ENV === 'production'
    ? compose
    : _.defaultTo(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__, compose);

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(ReduxPromise, thunk, ipcConnect),
      syncStore(['downloads', 'local.expandedFolders'])
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}
