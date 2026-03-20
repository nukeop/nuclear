import { act } from '@testing-library/react';

import { useSettingsModalStore } from '../../stores/settingsModalStore';
import { useStartupStore } from '../../stores/startupStore';
import { DashboardProviderBuilder } from '../../test/builders/DashboardProviderBuilder';
import { PlaylistProviderBuilder } from '../../test/builders/PlaylistProviderBuilder';
import { TOP_TRACKS_RADIOHEAD } from '../../test/fixtures/dashboard';
import { DashboardWrapper } from './Dashboard.test-wrapper';

describe('Dashboard view', () => {
  beforeEach(() => {
    DashboardWrapper.reset();
  });

  it('shows empty state when no providers are registered', async () => {
    await DashboardWrapper.mount();

    expect(DashboardWrapper.emptyState).toBeInTheDocument();
    expect(DashboardWrapper.emptyStateAction.element).toBeInTheDocument();
    expect(DashboardWrapper.topTracks.table).not.toBeInTheDocument();
  });

  it('opens the plugin store when clicking the empty state action', async () => {
    await DashboardWrapper.mount();

    await DashboardWrapper.emptyStateAction.click();

    const { isOpen, activeTab } = useSettingsModalStore.getState();
    expect(isOpen).toBe(true);
    expect(activeTab).toBe('plugins');
  });

  it('renders tracks in a table when a provider supplies top tracks', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.topTracksProvider(),
    );

    await DashboardWrapper.mount();

    expect(DashboardWrapper.emptyState).not.toBeInTheDocument();
    expect(DashboardWrapper.topTracks.heading).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack(
        'Everything In Its Right Place',
      ),
    ).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack('Idioteque'),
    ).toBeInTheDocument();
  });

  it('renders both tracks and artists when provider has both capabilities', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.topTracksAndArtistsProvider(),
    );

    await DashboardWrapper.mount();

    expect(DashboardWrapper.topTracks.heading).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack(
        'Everything In Its Right Place',
      ),
    ).toBeInTheDocument();

    expect(DashboardWrapper.topArtists.heading).toBeInTheDocument();
    expect(
      await DashboardWrapper.topArtists.artist('Radiohead').find(),
    ).toBeInTheDocument();
    expect(
      await DashboardWrapper.topArtists.artist('Björk').find(),
    ).toBeInTheDocument();
  });

  it('renders album cards when a provider supplies top albums', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.topAlbumsProvider(),
    );

    await DashboardWrapper.mount();

    expect(
      await DashboardWrapper.topAlbums.album('Kid A').find(),
    ).toBeInTheDocument();
    expect(DashboardWrapper.topAlbums.heading).toBeInTheDocument();
  });

  it('renders playlist cards when a provider supplies editorial playlists', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.editorialPlaylistsProvider(),
    );

    await DashboardWrapper.mount();

    expect(
      await DashboardWrapper.editorialPlaylists
        .playlist('Art Rock Essentials')
        .find(),
    ).toBeInTheDocument();
    expect(DashboardWrapper.editorialPlaylists.heading).toBeInTheDocument();
  });

  it('renders release cards when a provider supplies new releases', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.newReleasesProvider(),
    );

    await DashboardWrapper.mount();

    expect(
      await DashboardWrapper.newReleases.release('In Rainbows').find(),
    ).toBeInTheDocument();
    expect(DashboardWrapper.newReleases.heading).toBeInTheDocument();
  });

  it('navigates to search when clicking an artist card without metadataProviderId', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.topArtistsProviderWithoutMetadata(),
    );

    const { router } = await DashboardWrapper.mount();

    await DashboardWrapper.topArtists.artist('Radiohead').click();

    expect(router.state.location.pathname).toBe('/search');
    expect(router.state.location.search).toEqual({ q: 'Radiohead' });
  });

  it('shows a loader during startup instead of the empty state', async () => {
    act(() => {
      useStartupStore.getState().startStartup();
    });

    await DashboardWrapper.mount();

    expect(DashboardWrapper.loader).toBeInTheDocument();
    expect(DashboardWrapper.emptyState).not.toBeInTheDocument();
  });

  it('shows widgets when a provider registers after initial mount', async () => {
    await DashboardWrapper.mount();
    expect(DashboardWrapper.emptyState).toBeInTheDocument();

    DashboardWrapper.simulateStartupWithProvider(
      DashboardWrapper.fixtures.topTracksProvider(),
    );

    expect(DashboardWrapper.emptyState).not.toBeInTheDocument();
    expect(DashboardWrapper.topTracks.heading).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack(
        'Everything In Its Right Place',
      ),
    ).toBeInTheDocument();
  });

  it('navigates to playlist import when clicking a playlist card with a matching provider', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.editorialPlaylistsWithUrlProvider(),
    );
    DashboardWrapper.seedPlaylistProvider(
      new PlaylistProviderBuilder().thatMatchesUrl('music.example.com'),
    );

    const { router } = await DashboardWrapper.mount();

    await DashboardWrapper.editorialPlaylists
      .playlist('Art Rock Essentials')
      .click();

    expect(router.state.location.pathname).toBe(
      '/playlists/import/test-playlist-provider',
    );
    expect(router.state.location.search).toEqual({
      url: encodeURIComponent('https://music.example.com/playlist/12345'),
    });
  });

  it('stays on dashboard when clicking a playlist card with no matching provider', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.editorialPlaylistsWithUrlProvider(),
    );

    const { router } = await DashboardWrapper.mount();

    await DashboardWrapper.editorialPlaylists
      .playlist('Art Rock Essentials')
      .click();

    expect(router.state.location.pathname).toBe('/dashboard');
  });

  it('shows tracks from multiple providers', async () => {
    DashboardWrapper.seedProvider(
      new DashboardProviderBuilder()
        .withId('provider-a')
        .withName('Soundwave')
        .withCapabilities('topTracks')
        .withFetchTopTracks(async () => [TOP_TRACKS_RADIOHEAD[0]]),
    );
    DashboardWrapper.seedProvider(
      new DashboardProviderBuilder()
        .withId('provider-b')
        .withName('Wavelength')
        .withCapabilities('topTracks')
        .withFetchTopTracks(async () => [TOP_TRACKS_RADIOHEAD[1]]),
    );

    await DashboardWrapper.mount();

    expect(
      await DashboardWrapper.topTracks.findTrack(
        'Everything In Its Right Place',
      ),
    ).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack('Idioteque'),
    ).toBeInTheDocument();
  });
});
