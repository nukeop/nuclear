import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { buildStoreState } from '../../../test/storeBuilders';
import MainContentContainer from '../MainContentContainer';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';

describe('Search results container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should render empty search results', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should render relevant panes for the search results', () => {
    const state = buildStoreState()
      .withPlugins()
      .withSearchResults()
      .build();

    const { component } = mountComponent(state);
    expect(component.asFragment()).toMatchSnapshot();
  });
  
  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .build();

    const history = createMemoryHistory({
      initialEntries: ['/search']
    });

    const store = configureMockStore(initialState);

    const component = render(
      <TestRouterProvider
        history={history}
      >
        <TestStoreProvider
          store={store}
        >
          <MainContentContainer />
        </TestStoreProvider>
      </TestRouterProvider >
    );

    return { component, history, store };
  };
});
