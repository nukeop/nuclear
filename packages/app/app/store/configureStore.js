import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';

import rootReducer from '../reducers';
import syncStore from './enhancers/syncStorage';

export default function configureStore(initialState) {
  const composeEnhancers = process.env.NODE_ENV === 'production'
    ? compose
    : _.defaultTo(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__, compose);

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(ReduxPromise, thunk),
      syncStore(['downloads'])
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}
