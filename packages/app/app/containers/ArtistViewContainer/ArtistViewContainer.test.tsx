import { render, RenderResult, waitFor, within, screen } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import { store as electronStore } from '@nuclear/core';

import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { buildElectronStoreState, buildStoreState } from '../../../test/storeBuilders';
import userEvent from '@testing-library/user-event';

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

  it('should not render similar artists section if there are no similar artists', async () => {
    const stateWithArtistDetails = buildStoreState()
      .withArtistDetails()
      .build();
    const initialState = buildStoreState()
      .withArtistDetails({
        ['test-artist-id']: {
          ...stateWithArtistDetails.search.artistDetails['test-artist-id'],
          similar: []
        } 
      })
      .withPlugins()
      .withConnectivity()
      .build();

    const { component } = mountComponent(initialState);
    await waitFor(() => component.findByText(/popular tracks/i));
    const similarArtists = component.queryByText(/similar artists/i);
    expect(similarArtists).toBeNull();
  });

  it('should add a single track to queue after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    const firstTrack = await getTrackCell(component, 'test artist top track 1');
    await waitFor(() => within(firstTrack).getByTestId('add-to-queue').click());

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
        name: 'test artist'
      },
      title: 'test artist top track 1'
    }];
    const { component, store } = mountComponent(initialState);

    const firstTrack = await getTrackCell(component, 'test artist top track 1');
    await waitFor(() => within(firstTrack).getByTestId('add-to-queue').click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        title: 'test artist top track 1'
      })
    ]);
    expect(state.queue.queueItems[0].thumbnail).toBeUndefined();
  });

  it('should start playing a single track after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();

    const firstTrack = await getTrackCell(component, 'test artist top track 1');
    await waitFor(() => within(firstTrack).getByTestId('track-popup-trigger').click());
    await waitFor(() => screen.getByText(/play now/i).click());

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

    const firstTrack = await getTrackCell(component, 'test artist top track 1');
    await waitFor(() => within(firstTrack).getByTestId('track-popup-trigger').click());
    await waitFor(() => screen.getByText(/download/i).click());

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

  it('should add a top track to a playlist after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();
    
    const firstTrack = await getTrackCell(component, 'test artist top track 1');
    await waitFor(() => within(firstTrack).getByTestId('track-popup-trigger').click());
    await waitFor(() => screen.getByText(/add to playlist/i).click());
    await waitFor(() => screen.getByText('test playlist').click());
    
    const state = store.getState();
    
    expect(state.playlists.localPlaylists.data[0].tracks).toEqual([
      expect.objectContaining({
        artist: { name: 'test artist' },
        title: 'test artist top track 1'
      })
    ]);
  });
  
  it('should add a top track to favorites after clicking the button in the popup', async () => {
    const { component, store } = mountComponent();
    let state = store.getState();
    expect(state.favorites.tracks).toEqual([]);

    const firstTrack = await getTrackCell(component, 'test artist top track 1');
    await waitFor(() => within(firstTrack).getByTestId('track-popup-trigger').click());
    await waitFor(() => screen.getByText(/add to favorites/i).click());

    state = store.getState();
    expect(state.favorites.tracks).toEqual([
      expect.objectContaining({
        artist: 'test artist',
        name: 'test artist top track 1'
      })
    ]);
  });

  it('should add all top tracks to queue after clicking add all', async () => {
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

  it('should remove artist from favorites after clicking the heart if already in favorites', async () => {
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

  it('should filter artist\'s albums', async () => {
    const protoState = buildStoreState()
      .withArtistDetails()
      .withPlugins()
      .build();

    const mockFetchArtistAlbums = jest.fn().mockResolvedValue(
      protoState.search.artistDetails['test-artist-id'].releases
    );

    const { component, store } = mountComponent(
      buildStoreState()
        .withArtistDetails()
        .withPlugins({
          metaProviders: [{
            ...protoState.plugin.plugins.metaProviders[0],
            fetchArtistAlbums: mockFetchArtistAlbums
          }]
        })
        .withConnectivity()
        .build()
    );

    await waitFor(() => expect(store.getState().search.artistDetails['test-artist-id'].releases).toHaveLength(3));

    userEvent.type(await component.findByPlaceholderText('Filter...'), 'album 1');
    const albumCells = await component.findAllByTestId('album-card');
    expect(albumCells).toHaveLength(1);
    expect(albumCells[0]).toHaveTextContent('Test album 1');
  });

  it.each([{
    name: 'release date',
    text: 'Sort by release date',
    order: ['First test album', 'Test album 2', 'Test album 1']
  }, {
    name: 'A-Z',
    text: 'Sort A-Z',
    order: ['First test album', 'Test album 1', 'Test album 2']
  }])('should sort artist\'s albums by $name', async ({ text, order }) => {
    const protoState = buildStoreState()
      .withArtistDetails()
      .withPlugins()
      .build();

    const mockFetchArtistAlbums = jest.fn().mockResolvedValue(
      protoState.search.artistDetails['test-artist-id'].releases
    );

    const { component, store } = mountComponent(
      buildStoreState()
        .withArtistDetails()
        .withPlugins({
          metaProviders: [{
            ...protoState.plugin.plugins.metaProviders[0],
            fetchArtistAlbums: mockFetchArtistAlbums
          }]
        })
        .withConnectivity()
        .build()
    );

    await waitFor(() => expect(store.getState().search.artistDetails['test-artist-id'].releases).toHaveLength(3));

    userEvent.click(await component.findByRole('listbox'));
    const options = await component.findAllByRole('option');
    const targetOption = options.find(el => el.textContent === text);
    userEvent.click(targetOption);

    const albumCells = await component.findAllByTestId('album-card');
    await waitFor(() => expect(albumCells.map(cell => cell.textContent)).toEqual(order));
  });


  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withArtistDetails()
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

  const getTrackCell = async (component: RenderResult, trackName: string) => {
    const trackCells = await component.findAllByRole('cell');
    return trackCells.find(cell => cell.textContent === trackName);
  };
});
