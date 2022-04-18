import React from 'react';
import {createMemoryHistory} from 'history';
import { render } from '@testing-library/react';
import { unstable_HistoryRouter as Router } from 'react-router-dom';

import {App} from '../App';

export type AnyProps = {
    [k: string]: any;
  }

  type TestRouteProviderProps = {
    children: React.ReactNode;
    history: ReturnType<typeof createMemoryHistory>;
  }

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

export const mountComponent = (
  componentToMount: React.ReactElement,
  initialHistoryEntries: string[]) => {
  const history = createMemoryHistory({
    initialEntries: initialHistoryEntries
  });

  const component = render(
    <TestRouterProvider
      history={history}
    >
      {componentToMount}
    </TestRouterProvider>
  );

  return { component, history };
};

export const mountedAppFactory = (
  initialHistoryEntries: string[]
) => () => mountComponent(
  <App />,
  initialHistoryEntries
);
