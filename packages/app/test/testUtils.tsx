import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createMemoryHistory } from 'history';

import en from '@nuclear/i18n/src/locales/en.json';
import { Router } from 'react-router';
import thunk from 'redux-thunk';

export type AnyProps = {
  [k: string]: any;
}

type TestRouteProviderProps = {
  children: React.ReactNode;
  history: ReturnType<typeof createMemoryHistory>;
}

export const configureMockStore = () => configureStore([thunk]);

export const TestStoreProvider: React.FC<{
  initialState?: AnyProps;
  store?: ReturnType<ReturnType<typeof configureMockStore>>;
}> = ({ initialState = {}, store, children }) => {
  const mockStore = configureMockStore();
  return <Provider store={store || mockStore(initialState)}>
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
