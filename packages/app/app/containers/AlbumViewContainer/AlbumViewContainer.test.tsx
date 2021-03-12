import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';

import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { buildStoreState } from '../../../test/storeBuilders';

describe('Album view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display an album', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should show that an album is still loading', () => {
    const { component } = mountComponent(
      buildStoreState()
        .withPlugins()
        .withAlbumDetails({ loading: true })
        .build()
    );

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should search for artist after clicking his name', async () => {
    const { component, history } = mountComponent();
    expect(history.location.pathname).toBe('/album/test-album-id');
    await waitFor(() => component.getByText(/test artist/i).click());
    expect(history.location.pathname).toBe('/artist/test-artist-id');
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withAlbumDetails()
        .withArtistDetails()
        .withPlugins()
        .build();
    const history = createMemoryHistory({
      initialEntries: ['/album/test-album-id']
    });
    const mockStore = configureMockStore();
    const store = mockStore(initialState);
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
