import { waitFor } from '@testing-library/react';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';

describe('Album view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should display an album', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should show that an album is still loading', () => {
    const { component } = mountComponent(
      buildStoreState()
        .withPlugins()
        .withAlbumDetails({ ['test-album-id']: { loading: true } })
        .build()
    );

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should search for artist after clicking his name', async () => {
    const { component, history } = mountComponent();
    expect(history.location.pathname).toBe('/album/test-album-id');
    await waitFor(() => component.getByText(/test artist/i).click());
    expect(history.location.pathname).toBe('/artist/test-artist-id');
  });

  it('should add a single track to queue after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/test track 1/i).click());
    await waitFor(() => component.getByText(/add to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 1'
      })
    ]);
  });

  it('should start playing a single track after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/test track 1/i).click());
    await waitFor(() => component.getByText(/play now/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 1'
      })
    ]);
    expect(state.player.playbackStatus).toEqual('PLAYING');
  });

  it('should add a single track to downloads after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/test track 1/i).click());
    await waitFor(() => component.getByText(/download/i).click());

    const state = store.getState();
    expect(state.downloads).toEqual([
      {
        completion: 0,
        status: 'Waiting',
        track: expect.objectContaining({
          artist: 'test artist',
          name: 'test track 1'
        })
      }
    ]);
  });

  it('should add album to favorites after clicking the star', async () => {
    const { component, store } = mountComponent();
    let state = store.getState();
    expect(state.favorites.albums).toEqual([]);

    await waitFor(() => component.getByTestId(/add-remove-favorite/i).click());
    state = store.getState();
    expect(state.favorites.albums).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        title: 'test album'
      })
    ]);
  });

  it('should remove album from favorites after clicking the star if already in favorites', async () => {
    const { component, store } = mountComponent();
    let state = store.getState();
    expect(state.favorites.albums).toEqual([]);

    await waitFor(() => component.getByTestId(/add-remove-favorite/i).click());
    state = store.getState();
    expect(state.favorites.albums).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        title: 'test album'
      })
    ]);

    await waitFor(() => component.getByTestId(/add-remove-favorite/i).click());
    state = store.getState();
    expect(state.favorites.albums).toEqual([]);
  });

  it('should play all tracks in the album after clicking play all', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByText(/Play/i).click());

    const state = store.getState();
    expect(state?.queue?.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 1'
      }),
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 2'
      }),
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 3'
      })
    ]);
    expect(state.player.playbackStatus).toEqual('PLAYING');
  });

  it('should add album to queue after clicking the button', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('more-button').click());
    await waitFor(() => component.getByText(/Add album to queue/i).click());
    const state = store.getState();

    expect(state?.queue?.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 1'
      }),
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 2'
      }),
      expect.objectContaining({
        artist: 'test artist',
        name: 'test track 3'
      })
    ]);
  });

  it('should add album to downloads after clicking the button', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('more-button').click());
    await waitFor(() => component.getByText(/Download/i).click());
    const state = store.getState();
    expect(state.downloads).toEqual([
      {
        completion: 0,
        status: 'Waiting',
        track: expect.objectContaining({
          artist: 'test artist',
          name: 'test track 1',
          uuid: 'track-1-id'
        })
      },
      {
        completion: 0,
        status: 'Waiting',
        track: expect.objectContaining({
          uuid: 'track-2-id',
          artist: 'test artist',
          name: 'test track 2'
        })
      },
      {
        completion: 0,
        status: 'Waiting',
        track: expect.objectContaining({
          uuid: 'track-3-id',
          artist: 'test artist',
          name: 'test track 3'
        })
      }
    ]);
  });

  const mountComponent = mountedComponentFactory(
    ['/album/test-album-id'],
    buildStoreState()
      .withAlbumDetails()
      .withArtistDetails()
      .withPlugins()
      .withConnectivity()
      .build()
  );
});
