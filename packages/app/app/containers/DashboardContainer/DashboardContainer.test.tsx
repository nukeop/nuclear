
import { waitFor } from '@testing-library/react';
import pitchforkBnm from 'pitchfork-bnm';
import { Deezer } from '@nuclear/core/src/rest';

import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

jest.mock('pitchfork-bnm');
jest.mock('@nuclear/core/src/rest');

describe('Dashboard container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    const mockState = buildStoreState()
      .withDashboard()
      .build();

    pitchforkBnm.getBestNewAlbums = jest.fn().mockResolvedValue(mockState.dashboard.bestNewAlbums);
    pitchforkBnm.getBestNewTracks = jest.fn().mockResolvedValue(mockState.dashboard.bestNewTracks);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Deezer.getTopTracks = jest.fn().mockResolvedValue({ data: mockState.dashboard.topTracks });
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Deezer.mapDeezerTrackToInternal = jest.requireActual('@nuclear/core/src/rest').Deezer.mapDeezerTrackToInternal;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should display the best new music page of the dashboard', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getByText(/Best new music/i).click());
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should go to best new album review after clicking it', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getByText(/Best new music/i).click());

    await waitFor(() => component.getByText(/test title 2/i).click());

    expect(component.queryByText(/test review 2/i)).not.toBeNull();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should go to best new track review after clicking it', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getByText(/Best new music/i).click());

    await waitFor(() => component.getByText(/test track title 2/i).click());

    expect(component.queryByText(/track review 2/i)).not.toBeNull();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should add/remove a best new track to favorites after clicking its star', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getByText(/Best new music/i).click());

    const addOrRemove = async () => waitFor(
      () => component
        .getByTestId('favorite-icon-test track artist 1-test track title 1')
        .click()
    );

    await addOrRemove();

    let state = store.getState();
    expect(state.favorites.tracks).toEqual([
      expect.objectContaining({
        artist: 'test track artist 1',
        name: 'test track title 1'
      })
    ]);

    await addOrRemove();
    state = store.getState();

    expect(state.favorites.tracks).toEqual([]);
  });

  it('should display the trending music', async () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should search for the promoted artist using his meta provider', async () => {
    const { component, store, history } = mountComponent();
    await waitFor(() => component.getByText(/Check out/i).click());

    const state = store.getState();
    expect(state.plugin.selected.metaProviders).toEqual('Bandcamp Meta Provider');
    expect(state.search.unifiedSearchStarted).toBe(true);
  });

  it('should open the promoted artist link in an external browser', async () => {
    const { component } = mountComponent();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const shell = require('electron').shell;
    await waitFor(() => component.getByText(/External link/i).click());

    expect(shell.openExternal).toHaveBeenCalledWith('https://promoted-artist-1.example');
  });

  it('should display top tracks after going to top tracks tab', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByText(/top tracks/i).click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display genres after going to genres tab', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByText(/genres/i).click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should add a single track to the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/top tracks/i).click());
    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());
    await waitFor(() => component.getByText(/Add to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'top track artist 1',
        name: 'top track 1',
        thumbnail: 'top track album cover 1'
      })
    ]);
  });

  it('should add all top tracks to the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/Top tracks/i).click());
    await waitFor(() => component.getByTitle(/Toggle All Rows Selected/i).click());
    await waitFor(() => component.getByTestId('select-all-popup-trigger').click());
    await waitFor(() => component.getByText(/Add selected to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'top track artist 1',
        name: 'top track 1',
        thumbnail: 'top track album cover 1'
      }),
      expect.objectContaining({
        artist: 'top track artist 2',
        name: 'top track 2',
        thumbnail: 'top track album cover 2'
      })
    ]);
  });

  const mountComponent = mountedComponentFactory(
    ['/dashboard'],
    buildStoreState()
      .withDashboard()
      .withPlugins()
      .withConnectivity()
      .withSettings({
        promotedArtists: true
      })
      .build()
  );
});
