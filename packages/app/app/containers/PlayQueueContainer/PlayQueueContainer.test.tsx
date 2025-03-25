import { fireEvent, waitFor } from '@testing-library/react';
import { store as electronStore } from '@nuclear/core';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  AnyProps,
  mountedPlayQueueFactory,
  setupI18Next
} from '../../../test/testUtils';
import {
  buildElectronStoreState,
  buildStoreState
} from '../../../test/storeBuilders';

const createElementSnapshot = (element: HTMLElement): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(element.cloneNode(true));
  return fragment;
};

describe('Play Queue container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(async () => {
    const { store } = await import('@nuclear/core');
    store.clear();
  });

  it('should display tracks in the queue', async () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should collapse and expand the queue sidebar on click', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('queue-menu-collapse').click());

    let state = store.getState();
    expect(state.settings.compactQueueBar).toBe(true);

    await waitFor(() => component.getByTestId('queue-menu-collapse').click());
    state = store.getState();
    expect(state.settings.compactQueueBar).toBe(false);
  });

  it('should display a context popup on right click', async () => {
    const { component } = mountComponent();
    const track = await component.findByTestId('queue-popup-trigger-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));

    const popup = await screen.findByTestId('queue-popup-uuid1');
    expect(popup).toBeInTheDocument();
    expect(createElementSnapshot(popup)).toMatchSnapshot();
  });

  it('should display a context popup on right click for tracks without thumbnails', async () => {
    const { component } = mountComponent();
    const track = await component.findByTestId('queue-popup-trigger-uuid3');
    await waitFor(() => fireEvent.contextMenu(track));

    const popup = await screen.findByTestId('queue-popup-uuid3');
    expect(popup).toBeInTheDocument();
    expect(createElementSnapshot(popup)).toMatchSnapshot();
  });

  it('should select a new stream from the popup', async () => {
    const { component, store } = mountComponent();
    const track = component.getByTestId('queue-popup-trigger-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));

    await waitFor(() => component.getByRole('combobox').click());
    await waitFor(() =>
      component.getByText(/test track 1 - different stream/i).click()
    );
    const state = store.getState();
    await waitFor(() =>
      expect(state.queue.queueItems[0].streams[0].title).toBe(
        'test track 1 - different stream'
      )
    );
  });

  it('should copy the original track url to clipboard', async () => {
    const { component } = mountComponent();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const clipboard = require('electron').clipboard;

    const track = await component.findByTestId('queue-popup-trigger-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));
    await userEvent.click(component.getByTestId('copy-original-url'));
    expect(clipboard.writeText).toHaveBeenCalledWith(
      'https://test-track-original-url'
    );
  });

  it('should not display the copy original track url button if the url is not included in the current stream', async () => {
    const { component } = mountComponent();
    const track = component.getByTestId('queue-popup-trigger-uuid2');
    await waitFor(() => fireEvent.contextMenu(track));
    const copyButton = component.queryByTestId('copy-original-url');
    expect(copyButton).toEqual(null);
  });

  it('should favorite track without stream data (track queue popup)', async () => {
    const { component, store } = mountComponent();

    const track = component.getByTestId('queue-popup-trigger-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));
    await waitFor(() => component.getByTestId('queue-popup-favorite').click());

    const state = store.getState();
    expect(state.favorites.tracks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uuid: expect.any(String),
          artist: 'test artist 1',
          name: 'test track 1',
          thumbnail: 'https://test-track-thumb-url'
        })
      ])
    );

    expect(state.favorites.tracks[0].streams).toBeUndefined();
  });

  it('should favorite track without stream data (queue menu popup)', async () => {
    const { component, store } = mountComponent();

    await waitFor(() =>
      component.getByTestId('queue-menu-more-container').click()
    );
    await waitFor(() =>
      component.getByTestId('queue-menu-more-favorite').click()
    );

    const state = store.getState();
    expect(state.favorites.tracks).toEqual(
      expect.arrayContaining([
        {
          uuid: expect.any(String),
          artist: expect.stringMatching('test artist 1'),
          name: expect.stringMatching('test track 1'),
          thumbnail: 'https://test-track-thumb-url'
        }
      ])
    );

    expect(state.favorites.tracks[0].streams).toBeUndefined();
  });

  it('should add the current track to a playlist (queue menu popup)', async () => {
    const { component, store } = mountComponent();

    await waitFor(() =>
      component.getByTestId('queue-menu-more-container').click()
    );
    await waitFor(() => component.getByText(/Add to playlist/i).click());
    await waitFor(() => component.getAllByText('test playlist')[1].click());

    const state = store.getState();

    expect(state.playlists.localPlaylists.data[0].tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist 1',
        name: 'test track 1'
      })
    ]);
  });

  it('should create a new playlist from the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() =>
      component.getByTestId('queue-menu-more-container').click()
    );
    await waitFor(() => component.getByText(/Save as playlist/i).click());
    userEvent.type(
      component.getByPlaceholderText('Playlist name...'),
      '{selectall}{backspace}my  new playlist{enter}'
    );

    const state = store.getState();

    expect(state.playlists.localPlaylists.data[1].name).toBe('my new playlist');
    expect(state.playlists.localPlaylists.data[1].tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist 1',
        name: 'test track 1'
      }),
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 2'
      }),
      expect.objectContaining({
        artist: 'test artist 3',
        name: 'test track 3'
      })
    ]);
  });

  it('should add all tracks from the queue to the existing playlist', async () => {
    const { component, store } = mountComponent();

    await waitFor(() =>
      component.getByTestId('queue-menu-more-container').click()
    );
    await waitFor(() => component.getByText(/Add queue to playlist/i).click());
    await waitFor(() => component.getAllByText('test playlist')[0].click());

    const state = store.getState();

    expect(state.playlists.localPlaylists.data[0].name).toBe('test playlist');
    expect(state.playlists.localPlaylists.data[0].tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist 1',
        name: 'test track 1'
      }),
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 2'
      }),
      expect.objectContaining({
        artist: 'test artist 3',
        name: 'test track 3'
      })
    ]);
  });

  it('should clear the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() =>
      component.getByTestId('queue-menu-more-container').click()
    );
    await waitFor(() => component.getByText(/Clear queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([]);
  });

  it('should remove the clicked track from the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() =>
      component.getAllByTestId('queue-item-remove')[0].click()
    );

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist 2',
        name: 'test track 2'
      }),
      expect.objectContaining({
        artist: 'test artist 3',
        name: 'test track 3'
      })
    ]);
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState =
      initialStore ||
      buildStoreState()
        .withTracksInPlayQueue()
        .withPlaylists([
          {
            id: 'test-playlist-id',
            name: 'test playlist',
            tracks: []
          }
        ])
        .withPlugins()
        .withConnectivity()
        .build();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    electronStore.init({
      ...buildElectronStoreState(),
      playlists: initialState.playlists.localPlaylists.data
    });

    return mountedPlayQueueFactory(['/dashboard'], initialState)();
  };
});
