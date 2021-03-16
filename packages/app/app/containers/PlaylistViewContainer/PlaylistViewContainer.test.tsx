import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';

describe('Playlist view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display a playlist', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should play all tracks in the playlist', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByText('Play').click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist 1',
        name: 'test track'
      }),
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 22'
      })
    ]);
    expect(state.player.playbackStatus).toEqual('PLAYING');
  });

  it('should add all tracks in the playlist to the queue', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('more-button').click());
    await waitFor(() => component.getByText(/Add playlist to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist 1',
        name: 'test track'
      }),
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 22'
      })
    ]);
    expect(state.player.playbackStatus).toEqual('PAUSED');
  });

  it('should delete the playlist', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('more-button').click());
    await waitFor(() => component.getByText(/delete/i).click());

    const state = store.getState();
    expect(state.playlists.playlists).toEqual([]);
  });

  it('should rename the playlist', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('rename-button').click());
    const input = component.getByPlaceholderText('Playlist name...');
    fireEvent.change(input, { target: { value: 'new name' } });
    await waitFor(() => component.getByText(/rename/i).click());

    const state = store.getState();
    expect(state.playlists.playlists[0].name).toEqual('new name');
  });

  it('should add a single track to the queue', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByText(/test track 22/i).click());
    await waitFor(() => component.getByText(/add to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 22'
      })
    ]);
  });

  it('should play a single track', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByText(/test track 22/i).click());
    await waitFor(() => component.getByText(/play now/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 22'
      })
    ]);
    expect(state.player.playbackStatus).toEqual('PLAYING');
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlugins()
        .withPlaylists()
        .withConnectivity()
        .build();

    const history = createMemoryHistory({
      initialEntries: ['/playlist/0']
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
