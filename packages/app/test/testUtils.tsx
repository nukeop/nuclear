import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createMemoryHistory } from 'history';
import en from '@nuclear/i18n/src/locales/en.json';
import thunk from 'redux-thunk';
import { Router } from 'react-router';

import rootReducer from '../app/reducers';
import syncStore from '../app/store/enhancers/syncStorage';

export type AnyProps = {
  [k: string]: any;
}

type TestRouteProviderProps = {
  children: React.ReactNode;
  history: ReturnType<typeof createMemoryHistory>;
}

export const configureMockStore = (initialState?: AnyProps) => createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    syncStore(['downloads'])
  )
);

export const TestStoreProvider: React.FC<{
  initialState?: AnyProps;
  store?: ReturnType<typeof configureMockStore>;
}> = ({ initialState = {}, store, children }) => {
  return <Provider store={store || configureMockStore(initialState)}>
    {children}
  </Provider>;
};

export const TestRouterProvider = ({
  children,
  history
}: TestRouteProviderProps) => {
  return (
    <Router
      history={history}
    >
      {children}
    </Router>
  );
};

export const setupI18Next = () => {
  i18n
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      debug: false,
      resources: { en }
    });

  return i18n;
};
