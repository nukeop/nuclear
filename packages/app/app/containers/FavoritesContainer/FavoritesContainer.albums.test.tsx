
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';

const updateStore = (favorites: object) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const store = require('@nuclear/core').store;
  store.set('favorites', favorites);
};

describe('Album view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should display favorite albums', () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore(favorites);
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display empty state', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should go to album page after clicking an album', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore(favorites);
    const { component, history } = mountComponent();

    await waitFor(() => component.getByText(/test album/i).click());

    expect(history.location.pathname).toBe('/album/test-album-1');
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .build();

    const history = createMemoryHistory({
      initialEntries: ['/favorites/albums']
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
