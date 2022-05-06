
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

  it('should show a popup when a track is clicked', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore('favorites', favorites);
    const { component } = mountComponent();

    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should call provider.search when playing a track with no streams', async () => {
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

    await waitFor(() => component.getAllByTestId('play-now')[1].click());

    expect(selectedStreamProvider.search).toBeCalled();
    expect(selectedStreamProvider.getStreamForId).not.toBeCalled();
  });

  it('should call provider.search when playing a track from favorites', async () => {
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

    await waitFor(() => component.getAllByTestId('play-now')[0].click());

    expect(selectedStreamProvider.search).toHaveBeenCalledWith({
      artist: 'test artist 1',
      track: 'test track 1'
    });
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
