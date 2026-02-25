import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import {
  act,
  render,
  RenderResult,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { useStartupStore } from '../../stores/startupStore';
import { DashboardProviderBuilder } from '../../test/builders/DashboardProviderBuilder';
import {
  EDITORIAL_PLAYLISTS_DASHBOARD,
  NEW_RELEASES_DASHBOARD,
  TOP_ALBUMS_DASHBOARD,
  TOP_ARTISTS_DASHBOARD,
  TOP_TRACKS_RADIOHEAD,
} from '../../test/fixtures/dashboard';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';

type MountResult = RenderResult & {
  router: ReturnType<typeof createRouter<typeof routeTree>>;
};

const findCard = (section: HTMLElement, text: string, label: string) => {
  const cards = within(section).getAllByTestId('card');
  const card = cards.find((card) => within(card).queryByText(text));
  if (!card) {
    throw new Error(`${label} "${text}" not found`);
  }
  return card;
};

export const DashboardWrapper = {
  reset() {
    providersHost.clear();
    resetInMemoryTauriStore();
    useStartupStore.setState({
      isStartingUp: false,
      startupFinishedAt: undefined,
      totalStartupTimeMs: undefined,
      pluginDurations: {},
    });
  },

  seedProvider(builder: DashboardProviderBuilder) {
    providersHost.register(builder.build());
  },

  simulateStartupWithProvider(builder: DashboardProviderBuilder) {
    act(() => {
      useStartupStore.getState().startStartup();
    });
    act(() => {
      providersHost.register(builder.build());
      useStartupStore.getState().finishStartup(100);
    });
  },

  async mount(): Promise<MountResult> {
    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    const router = createRouter({ routeTree, history });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const component = render(
      <App routerProp={router} queryClientProp={queryClient} />,
    );
    await screen.findByTestId('dashboard-view');
    return { ...component, router };
  },

  get loader() {
    return screen.queryByTestId('dashboard-loader');
  },

  get emptyState() {
    return screen.queryByTestId('dashboard-empty-state');
  },

  topTracks: {
    get heading() {
      return screen.queryByRole('heading', { name: /top tracks/i });
    },
    get table() {
      return screen.queryByTestId('dashboard-top-tracks');
    },
    async findTrack(title: string) {
      const table = await screen.findByTestId('dashboard-top-tracks');
      return within(table).findByText(title);
    },
  },

  topArtists: {
    get heading() {
      return screen.queryByRole('heading', { name: /top artists/i });
    },
    artist(name: string) {
      return {
        async find() {
          const section = await screen.findByTestId('dashboard-top-artists');
          return within(section).findByText(name);
        },
        async click() {
          const section = await screen.findByTestId('dashboard-top-artists');
          await userEvent.click(findCard(section, name, 'Artist card'));
        },
      };
    },
  },

  topAlbums: {
    get heading() {
      return screen.queryByRole('heading', { name: /top albums/i });
    },
    album(title: string) {
      return {
        async find() {
          const section = await screen.findByTestId('dashboard-top-albums');
          return within(section).findByText(title);
        },
        async click() {
          const section = await screen.findByTestId('dashboard-top-albums');
          await userEvent.click(findCard(section, title, 'Album card'));
        },
      };
    },
  },

  editorialPlaylists: {
    get heading() {
      return screen.queryByRole('heading', { name: /top playlists/i });
    },
    playlist(name: string) {
      return {
        async find() {
          const section = await screen.findByTestId(
            'dashboard-editorial-playlists',
          );
          return within(section).findByText(name);
        },
        async click() {
          const section = await screen.findByTestId(
            'dashboard-editorial-playlists',
          );
          await userEvent.click(findCard(section, name, 'Playlist card'));
        },
      };
    },
  },

  newReleases: {
    get heading() {
      return screen.queryByRole('heading', { name: /new releases/i });
    },
    release(title: string) {
      return {
        async find() {
          const section = await screen.findByTestId('dashboard-new-releases');
          return within(section).findByText(title);
        },
        async click() {
          const section = await screen.findByTestId('dashboard-new-releases');
          await userEvent.click(findCard(section, title, 'Release card'));
        },
      };
    },
  },

  fixtures: {
    topTracksProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('topTracks')
        .withFetchTopTracks(async () => TOP_TRACKS_RADIOHEAD);
    },
    topTracksAndArtistsProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('topTracks', 'topArtists')
        .withFetchTopTracks(async () => TOP_TRACKS_RADIOHEAD)
        .withFetchTopArtists(async () => TOP_ARTISTS_DASHBOARD);
    },
    topAlbumsProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('topAlbums')
        .withFetchTopAlbums(async () => TOP_ALBUMS_DASHBOARD);
    },
    editorialPlaylistsProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('editorialPlaylists')
        .withFetchEditorialPlaylists(async () => EDITORIAL_PLAYLISTS_DASHBOARD);
    },
    newReleasesProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('newReleases')
        .withFetchNewReleases(async () => NEW_RELEASES_DASHBOARD);
    },
    topArtistsProviderWithoutMetadata() {
      return new DashboardProviderBuilder()
        .withId('discovery-dashboard')
        .withName('Discovery')
        .withMetadataProviderId(undefined)
        .withCapabilities('topArtists')
        .withFetchTopArtists(async () => TOP_ARTISTS_DASHBOARD);
    },
  },
};
