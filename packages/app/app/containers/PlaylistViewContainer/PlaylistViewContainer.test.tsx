/* eslint-disable @typescript-eslint/no-var-requires */
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import { store as electronStore } from '@nuclear/core';
import { ipcRenderer } from 'electron';

import { buildElectronStoreState, buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { onReorder } from '.';
import userEvent from '@testing-library/user-event';

jest.mock('fs');
jest.mock('electron-store');
jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn()
  }
}));

describe('Playlist view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    electronStore.clear();
    jest.clearAllMocks();
    (ipcRenderer.invoke as jest.Mock).mockResolvedValue({ filePath: 'downloaded_playlist' });
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

    let state = store.getState();
    expect(state.playlists.localPlaylists.data).toHaveLength(2);

    await waitFor(() => component.getByTestId('more-button').click());
    await waitFor(() => component.getByText(/delete/i).click());

    state = store.getState();
    expect(state.playlists.localPlaylists.data).toHaveLength(1);
  });

  it('should export the playlist', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('more-button').click());
    await waitFor(() => component.getByText(/export/i).click());
    const state = store.getState();
    const fs = require('fs');
    const [playlist] = state.playlists.localPlaylists.data;
    
    // check if the IPC call was made with correct arguments
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('show-save-dialog', {
      defaultPath: playlist.name,
      filters: [
        { name: 'file', extensions: ['json'] }
      ],
      properties: ['createDirectory', 'showOverwriteConfirmation']
    });
    expect(ipcRenderer.invoke).toHaveBeenCalledTimes(1);
    
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
    expect(state.playlists.localPlaylists.data[0].name).toEqual('new name');
  });

  it('should update the last modified date when the playlist is modified', async () => {
    Date.now = jest.fn(() => (new Date('2021-01-01').valueOf()));
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('rename-button').click());
    const input = component.getByPlaceholderText('Playlist name...');
    fireEvent.change(input, { target: { value: 'new name' } });
    await waitFor(() => component.getByText(/rename/i).click());

    const state = store.getState();
    expect(state.playlists.localPlaylists.data[0].lastModified).toEqual(new Date('2021-01-01').valueOf());
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

  it('should delete a single track from the playlist', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByTestId('delete-button')[0].click());

    const state = store.getState();
    expect(state.playlists.localPlaylists.data[0].tracks).toHaveLength(1);
    expect(state.playlists.localPlaylists.data[0].tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 22'
      })
    ]);
  });

  it.each([
    { query: 'test track 22', by: 'track title' }, 
    { query: 'test artist 2', by: 'artist' }
  ])('should filter displayed tracks by $by', async ({ query }) => {
    const { component } = mountComponent();

    let rows = await component.findAllByTestId('track-table-row');
    expect(rows.length).toBe(2);
    userEvent.type(component.getByPlaceholderText('Filter...'), query);

    rows = await component.findAllByTestId('track-table-row');
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveTextContent('test track 22');
  });

  it('should delete a single track from the playlist when there are its duplicates', async () => {
    const initialStore = buildStoreState()
      .withPlugins()
      .withPlaylists([{
        id: 'test-playlist-id',
        name: 'test playlist',
        lastModified: 1000198000000,
        tracks: [{
          uuid: 'test-track-uuid-1',
          artist: 'test artist 1',
          name: 'test track 1',
          stream: undefined
        }, {
          uuid: 'test-track-uuid-1',
          artist: 'test artist 1',
          name: 'test track 1',
          stream: undefined
        }, {
          uuid: 'test-track-uuid-3',
          artist: 'test artist 2',
          name: 'test track 2',
          stream: undefined
        }]}])
      .withConnectivity()
      .build();
    const { component, store } = mountComponent(initialStore);
    await waitFor(() => component.getAllByTestId('delete-button')[1].click());

    const state = store.getState();
    expect(state.playlists.localPlaylists.data[0].tracks).toHaveLength(2);
    expect(state.playlists.localPlaylists.data[0].tracks).toEqual([
      expect.objectContaining({
        uuid: 'test-track-uuid-1',
        artist: 'test artist 1',
        name: 'test track 1'
      }),
      expect.objectContaining({
        uuid: 'test-track-uuid-3',
        artist: 'test artist 2',
        name: 'test track 2'
      })
    ]);
  });

  const mountComponent = (initialStore?: AnyProps, initStore = true) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlugins()
        .withPlaylists()
        .withConnectivity()
        .build();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    initStore && electronStore.init({
      ...buildElectronStoreState(),
      playlists: initialState.playlists.localPlaylists.data
    });

    const history = createMemoryHistory({
      initialEntries: ['/playlist/test-playlist-id']
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

  let reorder: ReturnType<typeof onReorder>;

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
