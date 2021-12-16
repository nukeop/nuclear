
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import _ from 'lodash';

import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';

const updateStore = (key: string, value: object) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const store = require('@nuclear/core').store;
  store.set(key, value);
};

describe('Track view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should display favorite tracks', () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore('favorites', favorites);
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display empty state', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should show popup when a track is clicked', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore('favorites', favorites);
    const { component } = mountComponent();

    await waitFor(() => component.getByTestId('fav-track-uuid1').click());
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should call provider.search when play track with no stream', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore('favorites', favorites);

    const { component, store } = mountComponent();
    const state = store.getState();
    const selectedStreamProvider = _.find(
      state.plugin.plugins.streamProviders, 
      { sourceName: state.plugin.selected.streamProviders });

    await waitFor(() => component.getByTestId('fav-track-uuid2').click());
    await waitFor(() => component.getByTestId('track-popup-add-queue').click());

    expect(selectedStreamProvider.search).toBeCalled();
    expect(selectedStreamProvider.getStreamForId).not.toBeCalled();
  });

  it('should call provider.getStreamForId when play track with known stream', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore('favorites', favorites);

    const { component, store } = mountComponent();
    const state = store.getState();
    const selectedStreamProvider = _.find(
      state.plugin.plugins.streamProviders, 
      { sourceName: state.plugin.selected.streamProviders });

    await waitFor(() => component.getByTestId('fav-track-uuid1').click());
    await waitFor(() => component.getByTestId('track-popup-add-queue').click());

    expect(selectedStreamProvider.search).not.toBeCalled();
    expect(selectedStreamProvider.getStreamForId).toBeCalled();
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlugins()
        .withConnectivity()
        .withPlaylists()
        .build();

    const history = createMemoryHistory({
      initialEntries: ['/favorites/tracks']
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
      </TestRouterProvider >, {container: document.body}
    );
    return { component, history, store };
  };
});
