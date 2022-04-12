import { fireEvent, waitFor } from '@testing-library/react';
import { store as electronStore } from '@nuclear/core';

import { AnyProps, mountedPlayQueueFactory, setupI18Next } from '../../../test/testUtils';
import { buildElectronStoreState, buildStoreState } from '../../../test/storeBuilders';

describe('Play Queue container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should display with track in queue', async () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display a context popup on right click', async () => {
    const { component } = mountComponent();
    const track = component.getByTestId('queue-popup-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display a context popup on right click for tracks without thumbnails', async () => {
    const { component } = mountComponent();
    const track = component.getByTestId('queue-popup-uuid3');
    await waitFor(() => fireEvent.contextMenu(track));
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should copy original track url to clipboard', async () => {
    const { component } = mountComponent();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const clipboard = require('electron').clipboard;

    const track = component.getByTestId('queue-popup-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));
    await waitFor(() => component.getByTestId('copy-original-url').click());
    expect(clipboard.writeText).toHaveBeenCalledWith('https://test-track-original-url');
  });

  it('should not display copy original track url button if the url is not included in the current stream', async () => {
    const { component } = mountComponent();
    const track = component.getByTestId('queue-popup-uuid2');
    await waitFor(() => fireEvent.contextMenu(track));
    const copyButton = component.queryByTestId('copy-original-url');
    expect(copyButton).toEqual(null);
  });

  it('should favorite track with stream data (track queue popup)', async () => {
    const { component, store } = mountComponent();

    const track = component.getByTestId('queue-popup-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));
    await waitFor(() => component.getByTestId('queue-popup-favorite').click());

    const state = store.getState();
    expect(state.favorites.tracks).toEqual(expect.arrayContaining([
      expect.objectContaining({
        artist: expect.stringMatching('test artist 1'),
        name: expect.stringMatching('test track 1'),
        streams: expect.arrayContaining([
          expect.objectContaining({
            source: expect.stringMatching('Test Stream Provider'),
            id: expect.stringMatching('CuklIb9d3fI')
          })])
      })
    ]));
  });

  it('should favorite track with stream data (queue menu popup)', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByTestId('queue-menu-more-container').click());
    await waitFor(() => component.getByTestId('queue-menu-more-favorite').click());

    const state = store.getState();
    expect(state.favorites.tracks).toEqual(expect.arrayContaining([
      expect.objectContaining({
        artist: expect.stringMatching('test artist 1'),
        name: expect.stringMatching('test track 1'),
        streams: expect.arrayContaining([
          expect.objectContaining({
            source: expect.stringMatching('Test Stream Provider'),
            id: expect.stringMatching('CuklIb9d3fI')
          })])
      })
    ]));
  });

  it('should add the current track to a playlist (queue menu popup)', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByTestId('queue-menu-more-container').click());
    await waitFor(() => component.getByText(/Add to playlist/i).click());
    await waitFor(() => component.getByText('test playlist').click());

    const state = store.getState();

    expect(state.playlists.localPlaylists.data[0].tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist 1',
        name: 'test track 1'
      })
    ]);
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore || buildStoreState()
      .withTracksInPlayQueue()
      .withPlaylists([{
        id: 'test-playlist-id',
        name: 'test playlist',
        tracks: []
      }])
      .withPlugins()
      .withConnectivity()
      .build();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    electronStore.init({
      ...buildElectronStoreState(),
      playlists: initialState.playlists.localPlaylists.data
    });
    
    return mountedPlayQueueFactory(
      ['/dashboard'],
      initialState      
    )();
  };
});
