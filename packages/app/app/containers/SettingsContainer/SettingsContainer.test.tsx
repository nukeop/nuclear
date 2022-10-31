/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { waitFor } from '@testing-library/react'; import fetchMock from 'fetch-mock';
import { store as electronStore } from '@nuclear/core';

import { buildElectronStoreState, buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, mountedComponentFactory, setupI18Next } from '../../../test/testUtils';
import { range } from 'lodash';

jest.mock('electron-store', () => jest.fn().mockImplementation(() => ({
  get: jest.fn(),
  set: jest.fn()
})));

jest.mock('../../globals', () => ({
  lastfmApiKey: 'last_fm_key',
  lastfmApiSecret: 'last_fm_secret'
}));

describe('Settings view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    fetchMock.reset();
    electronStore.clear();
    process.env.LAST_FM_API_KEY = 'last_fm_key';
    process.env.LAST_FM_API_SECRET = 'last_fm_secret';
  });

  it('should render settings', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should import last.fm favorites (less than 1000)', async () => {
    const coreMock = require('@nuclear/core');
    const LastFmApi = jest.requireActual('@nuclear/core/src/rest/Lastfm');
    coreMock.rest.LastFmApi.mockImplementation(
      (key, secret) =>
        new LastFmApi.default(key, secret)
    );
    const totalTracks = 3;
    const tracksFromLastfm = createTracksFromLastfm(totalTracks);

    withNumberOfTracks(totalTracks);
    withLovedTracks(3, 1, totalTracks, tracksFromLastfm);

    const { component, store } = mountComponent({
      lastFm: {
        lastFmName: 'nuclear'
      }
    });
    await waitFor(() => component.getByText('Import').click());
    const state = store.getState();

    expect(state.favorites.tracks).toEqual(tracksFromLastfm);
    expect(electronStore.get('favorites')).toEqual(expect.objectContaining({
      tracks: tracksFromLastfm
    }));
  });

  it('should import last.fm favorites (more than 1000)', async () => {
    const coreMock = require('@nuclear/core');
    const LastFmApi = jest.requireActual('@nuclear/core/src/rest/Lastfm');
    coreMock.rest.LastFmApi.mockImplementation(
      (key, secret) =>
        new LastFmApi.default(key, secret)
    );
    const totalTracks = 4500;
    const tracksFromLastfm = createTracksFromLastfm(totalTracks);

    withNumberOfTracks(totalTracks);
    withLovedTracks(1000, 1, totalTracks, tracksFromLastfm.slice(0, 1000));
    withLovedTracks(1000, 2, totalTracks, tracksFromLastfm.slice(1000, 2000));
    withLovedTracks(1000, 3, totalTracks, tracksFromLastfm.slice(2000, 3000));
    withLovedTracks(1000, 4, totalTracks, tracksFromLastfm.slice(3000, 4000));
    withLovedTracks(1000, 5, totalTracks, tracksFromLastfm.slice(4000, 4500));

    const { component, store } = mountComponent({
      lastFm: {
        lastFmName: 'nuclear'
      }
    });
    await waitFor(() => component.getByText('Import').click());
    const state = store.getState();

    expect(state.favorites.tracks).toEqual(tracksFromLastfm);
    expect(electronStore.get('favorites')).toEqual(expect.objectContaining({
      tracks: tracksFromLastfm
    }));
  });

  const mountComponent = (electronStoreState?: AnyProps) => {
    // @ts-ignore
    electronStore.init({
      ...buildElectronStoreState(electronStoreState)
    });

    return mountedComponentFactory(
      ['/settings'],
      buildStoreState()
        .withConnectivity()
        .build()
    )();
  };

  const createTracksFromLastfm = (totalTracks: number) => range(totalTracks).map(num => ({
    artist: `artist ${num}`,
    name: `track ${num}`
  }));

  const tracksApiResponse = (track: object[], totalTracks: number) => ({
    lovedtracks: {
      track,
      '@attr': {
        total: totalTracks.toString()
      }
    }
  });

  const withNumberOfTracks = (totalTracks: number) => fetchMock.post('https://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=nuclear&format=json&limit=1&page=1&api_key=last_fm_key', tracksApiResponse([], totalTracks));

  const withLovedTracks = (limit: number, page: number, totalTracks: number, tracks: object[]) => fetchMock.post(`https://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=nuclear&format=json&limit=${limit}&page=${page}&api_key=last_fm_key`, tracksApiResponse(tracks, totalTracks));
});
