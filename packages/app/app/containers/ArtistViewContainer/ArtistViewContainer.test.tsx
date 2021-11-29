import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';

import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { buildStoreState } from '../../../test/storeBuilders';

describe('Artist view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should display an artist', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should show that an artist is still loading', () => {
    const { component } = mountComponent(
      buildStoreState()
        .withPlugins()
        .withArtistDetails({ ['test-artist-id']: { loading: true } })
        .build()
    );

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should search for tags after clicking his tag', async () => {
    const { component, history } = mountComponent();
    expect(history.location.pathname).toBe('/artist/test-artist-id');
    await waitFor(() => component.getByText(/#tag1/i).click());
    expect(history.location.pathname).toBe('/tag/tag1');
  });

  it('should search for similar artist after clicking his name', async () => {
    const { component, history } = mountComponent();
    expect(history.location.pathname).toBe('/artist/test-artist-id');
    await waitFor(() => component.getByText(/artist-similar-1/i).click());
    expect(history.location.pathname).toBe('/artist/artist-similar-id');
  });

  it('should add a single track to queue after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/test artist top track 1/i).click());
    await waitFor(() => component.getByText(/add to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 1'
      })
    ]);
  });

  it('tracks without thumbnails should have undefined', async () => {
    const initialState = buildStoreState()
      .withArtistDetails()
      .withPlugins()
      .withConnectivity()
      .build();

    initialState.search.artistDetails['test-artist-id'].topTracks = [{
      artist: {
        mbid: 'test mbid',
        name: 'test artist',
        url: 'test artist url'
      },
      name: 'test artist top track 1',
      title: 'test artist top track 1'
    }];
    const { component, store } = mountComponent(initialState);

    await waitFor(() => component.getByText(/test artist top track 1/i).click());
    await waitFor(() => component.getByText(/add to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 1',
        thumbnail: undefined
      })
    ]);
  });

  it('should start playing a single track after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/test artist top track 1/i).click());
    await waitFor(() => component.getByText(/play now/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 1'
      })
    ]);
    expect(state.player.playbackStatus).toEqual('PLAYING');
  });

  it('should add a single track to downloads after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/test artist top track 1/i).click());
    await waitFor(() => component.getByText(/download/i).click());

    const state = store.getState();
    expect(state.downloads).toEqual([
      {
        completion: 0,
        status: 'Waiting',
        track: expect.objectContaining({
          artist: 'test artist',
          name: 'test artist top track 1'
        })
      }
    ]);
  });

  it('should add a top track to favorites after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();
    let state = store.getState();
    expect(state.favorites.tracks).toEqual([]);

    await waitFor(() => component.getByText(/test artist top track 1/i).click());
    await waitFor(() => component.getByText(/add to favorites/i).click());

    state = store.getState();
    expect(state.favorites.tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 1'
      })
    ]);
  });

  it('should add all top to queue tracks after clicking add all', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByText(/add all/i).click());

    const state = store.getState();
    expect(state?.queue?.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 1'
      }),
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 2'
      }),
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 3'
      })
    ]);
  });

  it('should add artist to favorites after clicking the heart', async () => {
    const { component, store } = mountComponent();
    let state = store.getState();
    expect(state.favorites.artists).toEqual([]);

    await waitFor(() => component.getByTestId(/add-remove-favorite/i).click());
    state = store.getState();

    expect(state.favorites.artists).toEqual([
      expect.objectContaining({
        id: 'test-artist-id',
        name: 'test artist'
      })
    ]);
  });

  it('should remove artist from favorites after clicking the star if already in favorites', async () => {
    const { component, store } = mountComponent();
    let state = store.getState();
    expect(state.favorites.artists).toEqual([]);

    await waitFor(() => component.getByTestId(/add-remove-favorite/i).click());
    state = store.getState();
    expect(state.favorites.artists).toEqual([
      expect.objectContaining({
        id: 'test-artist-id',
        name: 'test artist'
      })
    ]);

    await waitFor(() => component.getByTestId(/add-remove-favorite/i).click());
    state = store.getState();
    expect(state.favorites.artists).toEqual([]);
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withArtistDetails()
        .withPlugins()
        .withConnectivity()
        .build();
    const history = createMemoryHistory({
      initialEntries: ['/artist/test-artist-id']
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
