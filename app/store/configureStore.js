import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import {queryMiddleware} from 'redux-query';
import SuperagentInterface from 'redux-query-interface-superagent';
import rootReducer from '../reducers';
import { getEntities, getQueries } from '../selectors/redux-query';

export default function configureStore(initialState) {
  const composeEnhancers = process.env.NODE_ENV === 'production'
    ? compose
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; 

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(ReduxPromise, thunk, queryMiddleware(SuperagentInterface, getQueries, getEntities))
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}
