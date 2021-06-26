import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { onReorder } from '.';

jest.mock('fs');

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

  it('should export the playlist', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('more-button').click());
    await waitFor(() => component.getByText(/export/i).click());
    const state = store.getState();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const remote = require('electron').remote;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const [playlist] = state.playlists.playlists;
    // check if the dialog was open
    expect(remote.dialog.showSaveDialog).toHaveBeenCalledWith({
      defaultPath: playlist.name,
      filters: [
        { name: 'file', extensions: ['json'] }
      ],
      properties: ['createDirectory', 'showOverwriteConfirmation']
    });
    expect(remote.dialog.showSaveDialog).toHaveBeenCalledTimes(1);
    // check if the playlist was properly exported 
    expect(fs.writeFile).toHaveBeenCalledWith(
      'downloaded_playlist',
      JSON.stringify(playlist, null, 2),
      expect.any(Function)
    );
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
    await waitFor(() => component.getAllByTestId('add-to-queue')[1].click());

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
    await waitFor(() => component.getAllByTestId('play-now')[1].click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 22'
      })
    ]);
    expect(state.player.playbackStatus).toEqual('PLAYING');
  });

  it('should add a single track to favorites', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByTestId('track-popup-trigger')[1].click());
    await waitFor(() => component.getByText(/add to favorites/i).click());

    const state = store.getState();
    expect(state.favorites.tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 22'
      })
    ]);
  });

  it('should add a single track to downloads', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByTestId('track-popup-trigger')[1].click());
    await waitFor(() => component.getByText(/download/i).click());

    const state = store.getState();
    expect(state.downloads).toEqual([
      expect.objectContaining({
        completion: 0,
        status: 'Waiting',
        track: expect.objectContaining({
          artist: 'test artist 2',
          name: 'test track 22'
        })
      })
    ]);
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

describe('Playlist view container - utils', () => {
  let playlist = {
    tracks: [1, 2, 3, 4]
  };

  let newPlaylist = {};
  const updatePlaylist = playlistState => {
    newPlaylist = playlistState;
  };

  let reorder;
  
  beforeEach(() => {
    newPlaylist = {};
    playlist = {
      tracks: [1, 2, 3, 4]
    };
    reorder = onReorder(playlist, updatePlaylist);
  });
  it('should reorder tracks correctly (1)', () => {
    reorder(0, 2);
    expect(newPlaylist).toEqual({
      tracks: [2, 3, 1, 4]
    });
  });

  it('should reorder tracks correctly (2)', () => {
    reorder(1, 3);
    expect(newPlaylist).toEqual({
      tracks: [1, 3, 4, 2]
    });
  });

  it('should reorder tracks correctly (3)', () => {
    reorder(0, 1);
    expect(newPlaylist).toEqual({
      tracks: [2, 1, 3, 4]
    });
  });
});
