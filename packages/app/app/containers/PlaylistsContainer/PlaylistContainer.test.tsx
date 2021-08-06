import { render, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';

import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { buildStoreState } from '../../../test/storeBuilders';

describe('Playlist container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should display all playlists', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display empty playlists view', () => {
    const { component } = mountComponent(
      buildStoreState()
        .withPlaylists([])
        .build()
    );

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should go to playlist after click on it', async () => {
    const { component, history } = mountComponent();
    expect(history.location.pathname).toBe('/playlists');
    await waitFor(() => component.getByText(/test playlist 2/i).click());
    expect(history.location.pathname).toBe('/playlist/1');
  });

  it('should create an empty playlist custom name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.change(input, {target: {value: 'new-empty-playlist'}});
    await waitFor(() => component.getByTestId('create-playlist-accept').click());
    const state = store.getState();
    expect(state.playlists.playlists).toEqual([
      expect.objectContaining({
        name: 'new-empty-playlist'
      })
    ]);
  });

  it('should create an empty playlist default name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    await waitFor(() =>
      component.getByTestId('create-playlist-accept').click()
    );
    const state = store.getState();
    expect(state.playlists.playlists).toEqual([
      expect.objectContaining({
        name: 'New playlist'
      })
    ]);
  });

  it('should not create an empty playlist with empty name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() =>
      component.getByTestId('create-playlist-accept').click()
    );
    const state = store.getState();

    expect(state.playlists.playlists).not.toEqual([
      expect.objectContaining({
        name: ''
      })
    ]);
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlaylists()
        .withPlugins()
        .withConnectivity()
        .build();
    const history = createMemoryHistory({
      initialEntries: ['/playlists']
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
