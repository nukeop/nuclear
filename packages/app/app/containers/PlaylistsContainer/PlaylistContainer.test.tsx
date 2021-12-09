import { render, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import {
  mockDndSpacing,
  mockGetComputedStyle,
  makeDnd,
  DND_DIRECTION_DOWN
} from 'react-beautiful-dnd-test-utils';
import nock from 'nock';
import { store as electronStore } from '@nuclear/core';

import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { buildStoreState } from '../../../test/storeBuilders';

const initialStoreState = () => ({
  equalizer: {
    selected: 'Default'
  },
  downloads: [],
  favorites: {
    albums: [],
    tracks: []
  },
  playlists: []
});
describe('Playlist container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    electronStore.clear();
    nock.cleanAll();
    nock.restore();
  });

  it('should display all playlists', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display empty playlists view', () => {
    const { component } = mountComponent(
      buildStoreState()
        .withPlaylists([])
        .build()
    );

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should go to playlist after click on it', async () => {
    const { component, history } = mountComponent();
    expect(history.location.pathname).toBe('/playlists');
    await waitFor(() => component.getByText(/test playlist 2/i).click());
    expect(history.location.pathname).toBe('/playlist/1');
  });

  it('should create an empty playlist custom name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.change(input, { target: { value: 'new-empty-playlist' } });
    await waitFor(() => component.getByTestId('create-playlist-accept').click());
    const state = store.getState();
    expect(state.playlists.playlists).toEqual([
      expect.objectContaining({
        name: 'new-empty-playlist'
      })
    ]);
  });

  it('should create an empty playlist with default name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    await waitFor(() =>
      component.getByTestId('create-playlist-accept').click()
    );
    const state = store.getState();
    expect(state.playlists.playlists).toEqual([
      expect.objectContaining({
        name: 'New playlist'
      })
    ]);
  });

  it('should not create an empty playlist with an empty name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() =>
      component.getByTestId('create-playlist-accept').click()
    );
    const state = store.getState();

    expect(state.playlists.playlists).not.toEqual([
      expect.objectContaining({
        name: ''
      })
    ]);
  });

  it('should reorder playlists', async () => {
    mockGetComputedStyle();
    const { component, store } = mountComponent();
    let state = store.getState();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    electronStore.init({
      ...initialStoreState(),
      playlists: state.playlists.playlists
    });

    mockDndSpacing(component.container);

    await makeDnd({
      text: 'test playlist',
      direction: DND_DIRECTION_DOWN,
      positions: 1
    });

    state = store.getState();

    expect(state.playlists.playlists).toEqual([
      expect.objectContaining({ name: 'test playlist 2' }),
      expect.objectContaining({ name: 'test playlist' })
    ]);
  });

  it('should get the users playlists on mount if the user is logged in', async () => {
    const initialState = buildStoreState()
      .withPlaylists()
      .withPlugins()
      .withConnectivity()
      .withLoggedInUser()
      .build();
    mountComponent(initialState);

    electronStore.set('settings', {
      nuclearPlaylistsServiceUrl: 'http://playlists.nuclear'
    });

    nock('http://playlists.nuclear', {
      reqheaders: {
        'Content-type': 'application/json',
        Authorization: 'Bearer auth-token'
      }
    })
      .get('/users/1/playlists')
      .reply(200, {});

    expect(nock.isDone()).toBe(true);
  });

  it('should not get the user\'s playlists on mount if the user is not logged in', async () => {
    const initialState = buildStoreState()
      .withPlaylists()
      .withPlugins()
      .withConnectivity()
      .withLoggedInUser()
      .build();
    mountComponent(initialState);

    expect(nock.isDone()).toBe(true);
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlaylists()
        .withPlugins()
        .withConnectivity()
        .build();
    const history = createMemoryHistory({
      initialEntries: ['/playlists']
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
