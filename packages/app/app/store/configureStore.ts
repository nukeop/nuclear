import _ from 'lodash';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';

import rootReducer from '../reducers';
import syncStore from './enhancers/syncStorage';
import ipcConnect from './middlewares/ipc';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
  interface NodeModule {
    hot?: {
      accept: (path: string, callback: () => void) => void;
    };
  }
}

export default function configureStore(initialState) {
  const composeEnhancers = (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(ReduxPromise, thunk, ipcConnect),
      syncStore([
        'downloads', 
        'local.expandedFolders', 
        'plugin.selected',
        'nuclear.identity'
      ])
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
