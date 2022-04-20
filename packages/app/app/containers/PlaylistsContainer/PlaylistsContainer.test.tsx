/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import {
  mockDndSpacing,
  mockGetComputedStyle,
  makeDnd,
  DND_DIRECTION_DOWN
} from 'react-beautiful-dnd-test-utils';
import { store as electronStore } from '@nuclear/core';

import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';
import { buildElectronStoreState, buildStoreState } from '../../../test/storeBuilders';
import fetchMock from 'fetch-mock';
import { loadLocalPlaylistsAction } from '../../actions/playlists';

const stateWithPlaylists = buildStoreState()
  .withPlaylists()
  .build();

describe('Playlists container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    electronStore.clear();
    fetchMock.reset();
    fetchMock.get('http://playlists.nuclear/users/1/playlists', [], {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer auth-token'
      }
    });
  });

  it('should display all playlists', async () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display empty playlists view', () => {
    const { component } = mountComponent(
      buildStoreState()
        .withPlaylists([], false)
        .build()
    );

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display that playlists are loading', () => {
    const { component, store } = mountComponent();
    store.dispatch(loadLocalPlaylistsAction.request());

    expect(component.getByTestId('loader')).toBeInTheDocument();
  });

  it('should read playlists from store on mount', () => {
    const initialState = buildStoreState()
      .withPlugins()
      .withConnectivity()
      .build();
    // @ts-ignore
    electronStore.init({
      ...buildElectronStoreState(),
      playlists: stateWithPlaylists.playlists.localPlaylists.data
    });
    const { component } = mountComponent(initialState, false);
    expect(component.getByText(/test playlist 2/i)).toBeInTheDocument();
  });

  it('should go to playlist after clicking on it', async () => {
    const { component, history } = mountComponent();
    expect(history.location.pathname).toBe('/playlists');
    await waitFor(() => component.getByText(/test playlist 2/i).click());
    expect(history.location.pathname).toBe('/playlist/test-playlist-id-2');
  });

  it('should create an empty playlist with a custom name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.change(input, { target: { value: 'new-empty-playlist' } });
    await waitFor(() => component.getByTestId('create-playlist-accept').click());
    const state = store.getState();
    expect(state.playlists.localPlaylists.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'new-empty-playlist'
        })]));
  });

  it('should load webview after clicking on Import from url (Spotify)', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getByText('Import from url (Spotify)').click());
    const input = component.getByTestId('spotify-playlist-importer-input').firstChild;
    fireEvent.change(input, { target: { value: 'https://open.spotify.com/playlist/37i9dQZF1EtkaNAuJY7Tph' } });
    await waitFor(() => component.getByText('Import').click());
    const webview: HTMLWebViewElement = await waitFor(() => component.getByTestId('spotify-playlist-importer-webview'));

    expect(webview).toMatchSnapshot();
  });

  it('should create an empty playlist with default name', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    await waitFor(() =>
      component.getByTestId('create-playlist-accept').click()
    );
    const state = store.getState();
    expect(state.playlists.localPlaylists.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'New playlist'
        })
      ]));
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

    expect(state.playlists.localPlaylists.data).not.toEqual([
      expect.objectContaining({
        name: ''
      })
    ]);
  });
  
  it('should create an empty playlist with a custom name on enter keypress', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.change(input, { target: { value: 'new-empty-playlist' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    const state = store.getState();
    expect(state.playlists.localPlaylists.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'new-empty-playlist'
        })]));
  });

  it('should create an empty playlist with default name on enter keypress', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    const state = store.getState();
    expect(state.playlists.localPlaylists.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'New playlist'
        })
      ]));
  });

  it('should not create an empty playlist with an empty name on enter keypress', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByTestId('create-new').click());
    const input = component.getByTestId('create-playlist-input').firstChild;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    const state = store.getState();
    expect(state.playlists.localPlaylists.data).not.toEqual([
      expect.objectContaining({
        name: ''
      })
    ]);
  });

  it('should reorder playlists', async () => {
    mockGetComputedStyle();
    const { component, store } = mountComponent();
    let state = store.getState();

    mockDndSpacing(component.container);

    await makeDnd({
      text: 'test playlist',
      direction: DND_DIRECTION_DOWN,
      positions: 1
    });

    state = store.getState();

    expect(state.playlists.localPlaylists.data).toEqual([
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
      .withSettings({
        nuclearPlaylistsServiceUrl: 'http://playlists.nuclear'
      })
      .build();
    mountComponent(initialState);
    expect(fetchMock.done());
  });

  it('should not get the user\'s playlists on mount if the user is not logged in', async () => {
    const initialState = buildStoreState()
      .withPlaylists()
      .withPlugins()
      .withConnectivity()
      .withLoggedInUser()
      .build();
    mountComponent(initialState);

    expect(fetchMock.done());
  });

  const mountComponent = (initialStore?: AnyProps, initStore = true) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlaylists()
        .withPlugins()
        .withConnectivity()
        .build();

    // @ts-ignore
    initStore && electronStore.init({
      ...buildElectronStoreState(),
      playlists: initialState.playlists.localPlaylists.data
    });

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
