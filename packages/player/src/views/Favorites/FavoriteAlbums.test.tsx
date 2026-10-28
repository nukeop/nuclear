import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { stripResolutionState, type Track } from '@nuclearplayer/model';

import App from '../../App';
import { PlayerBarWrapper } from '../../integration-tests/PlayerBar.test-wrapper';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useQueueStore } from '../../stores/queueStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import {
  createMockCandidate,
  StreamingProviderBuilder,
} from '../../test/builders/StreamingProviderBuilder';
import { GIANT_STEPS } from '../../test/fixtures/albums';
import { createAlbumRef } from '../../test/fixtures/favorites';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { FavoriteAlbumsWrapper } from './FavoriteAlbums.test-wrapper';

const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: vi.fn(),
  },
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

const renderAtRoute = async (route: string) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const router = createRouter({ routeTree, history });
  const component = render(<App routerProp={router} />);
  await screen.findByTestId('favorite-albums-view');
  return component;
};

describe('FavoriteAlbums view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: true,
    });
  });

  it('(Snapshot) renders empty state', async () => {
    const { getByTestId } = await renderAtRoute('/favorites/albums');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('(Snapshot) renders with albums', async () => {
    useFavoritesStore.setState({
      albums: [
        {
          ref: createAlbumRef('musicbrainz', 'album-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createAlbumRef('musicbrainz', 'album-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    const { getByTestId } = await renderAtRoute('/favorites/albums');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('shows empty state when no favorite albums', async () => {
    await renderAtRoute('/favorites/albums');

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No favorite albums yet')).toBeInTheDocument();
  });

  it('renders album cards when favorites exist', async () => {
    useFavoritesStore.setState({
      albums: [
        {
          ref: createAlbumRef('musicbrainz', 'album-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createAlbumRef('musicbrainz', 'album-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/albums');

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
  });

  it('sorts albums by addedAtIso descending (most recent first)', async () => {
    const olderAlbum = createAlbumRef('musicbrainz', 'older');
    olderAlbum.title = 'Older Album';
    const newerAlbum = createAlbumRef('musicbrainz', 'newer');
    newerAlbum.title = 'Newer Album';

    useFavoritesStore.setState({
      albums: [
        { ref: olderAlbum, addedAtIso: '2026-01-10T10:00:00.000Z' },
        { ref: newerAlbum, addedAtIso: '2026-01-15T10:00:00.000Z' },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/albums');

    const cards = screen.getAllByTestId('card');
    expect(cards[0]).toHaveTextContent('Newer Album');
    expect(cards[1]).toHaveTextContent('Older Album');
  });

  it('navigates to album detail page when card is clicked', async () => {
    const user = userEvent.setup();
    const album = createAlbumRef('test-provider', 'test-album-id');
    album.title = 'Test Album';

    useFavoritesStore.setState({
      albums: [{ ref: album, addedAtIso: '2026-01-15T10:00:00.000Z' }],
      loaded: true,
    });

    await renderAtRoute('/favorites/albums');

    const card = screen.getByTestId('card');
    await user.click(card);

    await screen.findByTestId('album-view');
  });

  describe('without opening an album', () => {
    const existingTrack: Track = {
      title: 'Existing Track',
      artists: [],
      source: { provider: 'test', id: 'existing' },
    };

    const giantStepsTracks: Track[] = [
      'Countdown',
      'Giant Steps',
      'Spiral',
    ].map((title, index) => ({
      title,
      artists: [
        {
          name: 'John Coltrane',
          roles: [],
          source: { provider: 'test-metadata-provider', id: 'artist-1' },
        },
      ],
      album: {
        title: 'Giant Steps',
        artwork: GIANT_STEPS.artwork,
        source: GIANT_STEPS.source,
      },
      artwork: GIANT_STEPS.artwork,
      source: { provider: 'test-metadata-provider', id: `track-${index + 1}` },
    }));

    const queuedTracks = () =>
      useQueueStore.getState().items.map((item) => item.track);

    beforeEach(() => {
      providersHost.clear();
      useQueueStore.setState({ items: [], currentIndex: 0 });
      useQueueStore.getState().addToQueue([existingTrack]);
      FavoriteAlbumsWrapper.addFavorites(
        {
          title: 'Giant Steps',
          source: GIANT_STEPS.source,
        },
        createAlbumRef('test-metadata-provider', 'album-2'),
      );
    });

    it('plays an album in place of the queue', async () => {
      providersHost.register(
        MetadataProviderBuilder.albumDetailsProvider().build(),
      );
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack(async (artist: string, title: string) => [
            createMockCandidate(`candidate-${title}`, `${artist} - ${title}`),
          ])
          .build(),
      );

      await FavoriteAlbumsWrapper.mount();
      await FavoriteAlbumsWrapper.card(0).play();

      await vi.waitFor(() => {
        expect(PlayerBarWrapper.isPlaying).toBe(true);
      });
      expect(queuedTracks().map(stripResolutionState)).toEqual(
        giantStepsTracks,
      );
      expect(FavoriteAlbumsWrapper.view).toBeInTheDocument();
    });

    it('adds an album to the queue', async () => {
      providersHost.register(
        MetadataProviderBuilder.albumDetailsProvider().build(),
      );

      await FavoriteAlbumsWrapper.mount();
      await FavoriteAlbumsWrapper.card(0).menu.addToQueue();

      await vi.waitFor(() => {
        expect(queuedTracks()).toEqual([existingTrack, ...giantStepsTracks]);
      });
      expect(FavoriteAlbumsWrapper.view).toBeInTheDocument();
    });

    it("tells you when the album's tracks can't be loaded", async () => {
      providersHost.register(
        MetadataProviderBuilder.albumDetailsProvider()
          .withFetchAlbumDetails(async () => {
            throw new Error('Service unavailable');
          })
          .build(),
      );

      await FavoriteAlbumsWrapper.mount();
      await FavoriteAlbumsWrapper.card(0).play();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith('Failed to load tracks.', {
          description: 'Service unavailable',
        });
      });
      expect(queuedTracks()).toEqual([existingTrack]);
    });

    it('removes an album from favorites', async () => {
      await FavoriteAlbumsWrapper.mount();
      await FavoriteAlbumsWrapper.card(0).menu.removeFromFavorites();

      expect(FavoriteAlbumsWrapper.cardTitles).toEqual(['Album album-2']);
    });
  });
});
