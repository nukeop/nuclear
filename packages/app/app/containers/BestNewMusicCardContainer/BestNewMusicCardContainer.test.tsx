import { waitFor } from '@testing-library/react';
import pitchforkBnm from 'pitchfork-bnm';
import { Deezer } from '@nuclear/core/src/rest';

import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

describe('Dashboard container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    const mockState = buildStoreState()
      .withDashboard()
      .build();

    jest.mock('pitchfork-bnm', () => jest.fn().mockImplementation(() => ({
      getBestNewAlbums: jest.fn().mockResolvedValue(mockState.dashboard.bestNewAlbums),
      getBestNewTracks: jest.fn().mockResolvedValue(mockState.dashboard.bestNewTracks)
    })));

    jest.mock('@nuclear/core/src/rest', () => jest.fn().mockImplementation(() => ({
      getTopTracks: jest.fn().mockResolvedValue(mockState.dashboard.bestNewAlbums),
      mapDeezerTrackToInternal: jest.requireActual('@nuclear/core/src/rest').Deezer.mapDeezerTrackToInternal
    })));

  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render card album title, album artist, track title and track artist', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getByText(/Best new music/i).click());
    expect(component.queryByTestId('best-new-music-card-title-test title 1')).not.toBeNull();
    expect(component.queryByTestId('best-new-music-card-title-test title 2')).not.toBeNull();
    expect(component.queryByTestId('best-new-music-card-title-test track title 1')).not.toBeNull();
    expect(component.queryByTestId('best-new-music-card-title-test track title 2')).not.toBeNull();
    expect(component.queryByTestId('best-new-music-card-artist-test artist 1')).not.toBeNull();
    expect(component.queryByTestId('best-new-music-card-artist-test artist 2')).not.toBeNull();
    expect(component.queryByTestId('best-new-music-card-artist-test track artist 1')).not.toBeNull();
    expect(component.queryByTestId('best-new-music-card-artist-test track artist 2')).not.toBeNull();
    expect(component.asFragment()).toMatchSnapshot();
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
