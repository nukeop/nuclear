import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@nuclear/i18n/src/locales/en.json';
import { MemoryRouter } from 'react-router';

export type AnyProps = {
  [k: string]: any;
}

type TestRouteProviderProps = {
  children: React.ReactNode;
  initialEntries?: Array<any>;
}

export const TestStoreProvider: React.FC<{ initialStore?: AnyProps }> = ({ initialStore = {}, children }) => {
  const mockStore = configureStore();
  return <Provider store={mockStore(initialStore)}>
    {children}
  </Provider>;
};

export const TestRouterProvider = ({ children, initialEntries }: TestRouteProviderProps) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
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
