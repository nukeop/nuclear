import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import { Router } from 'react-router';
import { render } from '@testing-library/react';
import en from '@nuclear/i18n/src/locales/en.json';

import rootReducer from '../app/reducers';
import syncStore from '../app/store/enhancers/syncStorage';

import MainContentContainer from '../app/containers/MainContentContainer';
import HelpModalContainer from '../app/containers/HelpModalContainer';
import PlayQueueContainer from '../app/containers/PlayQueueContainer';
import Navbar from '../app/components/Navbar';
import NavButtons from '../app/components/NavButtons';


export type AnyProps = {
  [k: string]: any;
}

export const uuidRegex = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;

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
  componentToMount: React.ReactElement, 
  initialHistoryEntries: string[],
  initialStore?: AnyProps, 
  defaultInitialStore?: AnyProps,
  renderOptions?: {}) => {
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
        {componentToMount}
      </TestStoreProvider>
    </TestRouterProvider>, renderOptions
  );
  return { component, history, store };
};

export const mountedComponentFactory = (
  initialHistoryEntries: string[],
  defaultInitialStore?: AnyProps,
  AdditionalNodes?: React.FC
) =>
  (initialStore?: AnyProps) => mountComponent(
    <>
      <MainContentContainer />
      {AdditionalNodes && <AdditionalNodes />}
    </>,
    initialHistoryEntries,
    initialStore,
    defaultInitialStore
  );

export const mountedNavbarFactory= (
  initialHistoryEntries: string[],
  defaultInitialStore?: AnyProps
) =>
  (initialStore?: AnyProps) => mountComponent(
    <Navbar>
      <NavButtons />
      <HelpModalContainer />
    </Navbar>,
    initialHistoryEntries,
    initialStore,
    defaultInitialStore
  );
  
export const mountedPlayQueueFactory= (
  initialHistoryEntries: string[],
  defaultInitialStore?: AnyProps
) =>
  (initialStore?: AnyProps) => mountComponent(
    <PlayQueueContainer />,
    initialHistoryEntries,
    initialStore,
    defaultInitialStore,
    { container: document.body }
  );
