
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import _, { pick } from 'lodash';

import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import PlayerBarContainer from '../PlayerBarContainer';
import { PlaybackStatus } from '@nuclear/core';

const updateStore = (key: string, value: object) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const store = require('@nuclear/core').store;
  store.set(key, value);
};

describe('Favorite tracks view container', () => {
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

  it('should play a random track when the random button is clicked', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build().favorites;
    updateStore('favorites', favorites);
    const { component, store } = mountComponent();

    await waitFor(() => component.getByTestId('favorite-tracks-header-play-random').click());
    const state = store.getState();
    expect(state.queue.queueItems).toHaveLength(1);
    expect(favorites.tracks).toContainEqual(
      expect.objectContaining(pick(state.queue.queueItems[0], ['artist', 'title', 'duration', 'source'])
      ));
    expect(state.player.playbackStatus).toEqual('PLAYING');
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

  it('should not display the favorite button for tracks', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore('favorites', favorites);
    const { component } = mountComponent();
    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());

    expect(component.queryByText(/favorites/i)).toBeNull();
  });
  
  it('should not display the add to favorites all button for selected tracks', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;
    updateStore('favorites', favorites);
    const { component } = mountComponent();
    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());
    await waitFor(() => component.getByTitle('Toggle All Rows Selected').click());
    await waitFor(() => component.getByTestId('select-all-popup-trigger').click());
    await component.findByText(/add selected to queue/i);

    expect(component.queryByText(/add selected to favorites/i)).toBeNull();
  });

  it('should be able to sort favorite tracks by title, ascending', async () => {
    const favorites = buildStoreState()
      .withFavorites({
        tracks: [
          { name: 'DEF', artist: 'A' },
          { name: 'ABC', artist: 'A' },
          { name: 'GHI', artist: 'A' },
          { name: 'abc', artist: 'A' }
        ]
      })
      .build()
      .favorites;
    updateStore('favorites', favorites);
    const { component } = mountComponent();

    await waitFor(() => component.getByText('Title').click());
    const tracks = component.getAllByTestId('title-cell');

    expect(tracks[0].textContent).toEqual('ABC');
    expect(tracks[1].textContent).toEqual('DEF');
    expect(tracks[2].textContent).toEqual('GHI');
    expect(tracks[3].textContent).toEqual('abc');
  });

  it('should be able to sort favorite tracks by title, descending', async () => {
    const favorites = buildStoreState()
      .withFavorites({
        tracks: [
          { name: 'DEF', artist: 'A' },
          { name: 'ABC', artist: 'A' },
          { name: 'GHI', artist: 'A' },
          { name: 'abc', artist: 'A' }
        ]
      })
      .build()
      .favorites;

    updateStore('favorites', favorites);
    const { component } = mountComponent();

    await waitFor(() => component.getByText('Title').click());
    await waitFor(() => component.getByText('Title').click());
    const tracks = component.getAllByTestId('title-cell');

    expect(tracks[0].textContent).toEqual('abc');
    expect(tracks[1].textContent).toEqual('GHI');
    expect(tracks[2].textContent).toEqual('DEF');
    expect(tracks[3].textContent).toEqual('ABC');
  });


  it('should be able to sort favorite tracks by artist', async () => {
    const favorites = buildStoreState()
      .withFavorites({
        tracks: [
          { name: 'A', artist: 'DEF' },
          { name: 'B', artist: 'ABC' },
          { name: 'C', artist: 'GHI' },
          { name: 'D', artist: 'abc' }
        ]
      })
      .build()
      .favorites;
    updateStore('favorites', favorites);
    const { component } = mountComponent();

    await waitFor(() => component.getByText('Artist').click());
    const tracks = component.getAllByTestId('title-cell');

    expect(tracks[0].textContent).toEqual('B');
    expect(tracks[1].textContent).toEqual('A');
    expect(tracks[2].textContent).toEqual('C');
    expect(tracks[3].textContent).toEqual('D');
  });

  it('should be able to sort favorite tracks by position', async () => {
    const favorites = buildStoreState()
      .withFavorites()
      .build()
      .favorites;

    updateStore('favorites', favorites);
    const { component } = mountComponent();
    let tracks = component.getAllByTestId('title-cell');
    
    expect(tracks[0].textContent).toEqual('test track 2');
    expect(tracks[1].textContent).toEqual('test track 1');
    
    await waitFor(() => component.getByTestId('position-header').click());
    tracks = component.getAllByTestId('title-cell');

    expect(tracks[0].textContent).toEqual('test track 1');
    expect(tracks[1].textContent).toEqual('test track 2');
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
    expect(selectedStreamProvider.getStreamForId).toBeCalled();
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

    await waitFor(() => expect(selectedStreamProvider.search).toHaveBeenCalledWith({
      artist: 'test artist 2',
      track: 'test track 2'
    }));
  });

  it('should play a favorited local library track from a local stream', async () => {
    const favorites = buildStoreState()
      .withFavorites({
        tracks: [{
          uuid: 'local-track-1',
          artist: 'test artist 1',
          name: 'test track 1',
          local: true
        }]
      })
      .build()
      .favorites;
    updateStore('favorites', favorites);

    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByTestId('play-now')[0].click());
    const state = store.getState();
    expect(state.queue.queueItems[0]).toEqual(expect.objectContaining({
      uuid: 'local-track-1',
      artist: 'test artist 1',
      name: 'test track 1',
      local: true,
      streams: [{
        source: 'Local',
        stream: 'file:///home/nuclear/Music/local artist 1/local album 1/local track 1.mp3',
        duration: 300
      }]
    }));
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlugins()
        .withConnectivity()
        .withPlaylists()
        .withLocal()
        .withSettings({ useStreamVerification: false })
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
          <PlayerBarContainer />
        </TestStoreProvider>
      </TestRouterProvider >, { container: document.body }
    );
    return { component, history, store };
  };
});
