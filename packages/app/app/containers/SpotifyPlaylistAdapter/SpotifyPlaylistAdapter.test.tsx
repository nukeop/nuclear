/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Spotify } from '@nuclear/core/src/rest';

import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';
import userEvent from '@testing-library/user-event';

jest.mock('@nuclear/core/src/rest/Spotify');

describe('Spotfiy playlist adapter', () => {
  const mockSpotifyClient = {
    getPlaylist: jest.fn()
  };
  beforeAll(() => {
    setupI18Next();

    // @ts-ignore
    Spotify.SpotifyClientProvider = {
      get: jest.fn().mockResolvedValue(mockSpotifyClient)
    };

    // @ts-ignore
    Spotify.mapSpotifyTrack = jest.requireActual('@nuclear/core/src/rest/Spotify').mapSpotifyTrack;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should display a Spotify playlist', async () => {
    mockSpotifyClient.getPlaylist = jest.fn().mockResolvedValue(getMockedPlaylist());
    const { component } = mountComponent();
    await component.findByTestId('playlist-view');
    expect(component.asFragment()).toMatchSnapshot();
    expect(mockSpotifyClient.getPlaylist).toHaveBeenCalledWith('1');
  });

  it('should save the external playlist locally', async () => {
    mockSpotifyClient.getPlaylist = jest.fn().mockResolvedValue(getMockedPlaylist());
    const { component, store } = mountComponent();
    await component.findByTestId('playlist-view');
    userEvent.click(component.getByTestId('more-button'));
    userEvent.click(component.getByText('Save locally'));

    const state = store.getState();
    expect(state.playlists.localPlaylists.data).toHaveLength(1);
    expect(state.playlists.localPlaylists.data[0].name).toEqual(getMockedPlaylist().name);
    expect(state.playlists.localPlaylists.data[0].tracks).toEqual([{
      uuid: '1',
      name: 'Test track',
      album: 'Test album',
      artist: 'Test artist',
      duration: 120,
      thumbnail: 'thumb.jpg',
      stream: null
    }, {
      uuid: '2',
      name: 'Another test track',
      album: 'Another test album',
      artist: 'Another test artist',
      duration: 180,
      thumbnail: undefined,
      stream: null
    }]);
  });

  const mountComponent = mountedComponentFactory(
    ['/playlists/spotify/1'],
    buildStoreState()
      .withDashboard()
      .withPlugins()
      .withConnectivity()
      .build()
  );
});

const getMockedPlaylist = () => ({
  id: '1',
  name: 'Test Spotify playlist',
  tracks: [{
    id: '1',
    name: 'Test track',
    album: {
      id: '1',
      name: 'Test album',
      images: [
        { width: 300, height: 300, url: 'thumb.jpg' },
        { width: 600, height: 600, url: 'cover.jpg' },
        { width: 450, height: 450, url: 'another.jpg' }
      ]
    },
    artists: [{ name: 'Test artist' }],
    duration_ms: 1000 * 120
  }, {
    id: '2',
    name: 'Another test track',
    album: {
      id: '2',
      name: 'Another test album',
      images: []
    },
    artists: [{ name: 'Another test artist' }],
    duration_ms: 1000 * 180
  }]
});
