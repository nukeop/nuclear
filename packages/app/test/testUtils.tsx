import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import { Router } from 'react-router';
import en from '@nuclear/i18n/src/locales/en.json';

import rootReducer from '../app/reducers';
import syncStore from '../app/store/enhancers/syncStorage';
import { render } from '@testing-library/react';

import MainContentContainer from '../app/containers/MainContentContainer';
import HelpModalContainer from '../app/containers/HelpModalContainer';
import Navbar from '../app/components/Navbar';
import NavButtons from '../app/components/NavButtons';


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
    applyMiddleware(ReduxPromise, thunk),
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

export const mountComponent = (
  willMountComponent: React.ReactElement, 
  initialHistoryEntries: string[],
  initialStore?: AnyProps, 
  defaultInitialStore?: AnyProps) => {
  const initialState = initialStore || defaultInitialStore;

  const history = createMemoryHistory({
    initialEntries: initialHistoryEntries
  });
  const store = configureMockStore(initialState);
  const component = render(
    <TestRouterProvider
      history={history}
    >
      <TestStoreProvider
        store={store}
      >
        {willMountComponent}
      </TestStoreProvider>
    </TestRouterProvider>
  );
  return { component, history, store };
};

export const mountedComponentFactory = (
  initialHistoryEntries: string[],
  defaultInitialStore?: AnyProps
) =>
  (initialStore?: AnyProps) => {
    return mountComponent(
      <MainContentContainer />, 
      initialHistoryEntries, 
      initialStore, 
      defaultInitialStore
    );
  };

export const mountedNavbarFactory= (
  initialHistoryEntries: string[],
  defaultInitialStore?: AnyProps
) =>
  (initialStore?: AnyProps) => {
    return mountComponent(
      <Navbar>
        <NavButtons />
        <HelpModalContainer />
      </Navbar>, 
      initialHistoryEntries, 
      initialStore, 
      defaultInitialStore
    );
  };
