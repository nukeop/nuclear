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
import { createArtistRef } from '../../test/fixtures/favorites';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { FavoriteArtistsWrapper } from './FavoriteArtists.test-wrapper';

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
  await screen.findByTestId('favorite-artists-view');
  return component;
};

describe('FavoriteArtists view', () => {
  beforeEach(() => {
    providersHost.clear();
    resetInMemoryTauriStore();
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: true,
    });
  });

  it('(Snapshot) renders empty state', async () => {
    const { getByTestId } = await renderAtRoute('/favorites/artists');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('(Snapshot) renders with artists', async () => {
    useFavoritesStore.setState({
      artists: [
        {
          ref: createArtistRef('musicbrainz', 'artist-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createArtistRef('musicbrainz', 'artist-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    const { getByTestId } = await renderAtRoute('/favorites/artists');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('shows empty state when no favorite artists', async () => {
    await renderAtRoute('/favorites/artists');

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No favorite artists yet')).toBeInTheDocument();
  });

  it('renders artist cards when favorites exist', async () => {
    useFavoritesStore.setState({
      artists: [
        {
          ref: createArtistRef('musicbrainz', 'artist-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createArtistRef('musicbrainz', 'artist-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/artists');

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
  });

  it('sorts artists by addedAtIso descending (most recent first)', async () => {
    const olderArtist = createArtistRef('musicbrainz', 'older');
    olderArtist.name = 'Older Artist';
    const newerArtist = createArtistRef('musicbrainz', 'newer');
    newerArtist.name = 'Newer Artist';

    useFavoritesStore.setState({
      artists: [
        { ref: olderArtist, addedAtIso: '2026-01-10T10:00:00.000Z' },
        { ref: newerArtist, addedAtIso: '2026-01-15T10:00:00.000Z' },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/artists');

    const cards = screen.getAllByTestId('card');
    expect(cards[0]).toHaveTextContent('Newer Artist');
    expect(cards[1]).toHaveTextContent('Older Artist');
  });

  it('navigates to artist detail page when card is clicked', async () => {
    const user = userEvent.setup();
    const artist = createArtistRef('test-provider', 'test-artist-id');
    artist.name = 'Test Artist';

    const provider = new MetadataProviderBuilder()
      .withId('test-provider')
      .withArtistMetadataCapabilities(['artistBio'])
      .withFetchArtistBio(async () => ({
        name: 'Test Artist',
        artwork: { items: [] },
        source: { provider: 'test-provider', id: 'test-artist-id' },
      }))
      .build();
    providersHost.register(provider);

    useFavoritesStore.setState({
      artists: [{ ref: artist, addedAtIso: '2026-01-15T10:00:00.000Z' }],
      loaded: true,
    });

    await renderAtRoute('/favorites/artists');

    const card = screen.getByTestId('card');
    await user.click(card);

    await screen.findByRole('heading', { name: 'Test Artist' });
  });

  describe('without opening an artist', () => {
    const existingTrack: Track = {
      title: 'Existing Track',
      artists: [],
      source: { provider: 'test', id: 'existing' },
    };

    const deadmau5PopularTracks: Track[] = [
      {
        title: 'Strobe',
        artists: [
          {
            name: 'Deadmau5',
            roles: [],
            source: {
              provider: 'test-metadata-provider',
              id: 'test-artist-id',
            },
          },
        ],
        artwork: {
          items: [
            {
              url: 'https://img/track.jpg',
              purpose: 'thumbnail',
              width: 64,
            },
          ],
        },
        source: { provider: 'test-metadata-provider', id: 'track-1' },
      },
    ];

    const queuedTracks = () =>
      useQueueStore.getState().items.map((item) => item.track);

    beforeEach(() => {
      useQueueStore.setState({ items: [], currentIndex: 0 });
      useQueueStore.getState().addToQueue([existingTrack]);
      FavoriteArtistsWrapper.addFavorites(
        {
          name: 'Deadmau5',
          source: { provider: 'test-metadata-provider', id: 'test-artist-id' },
        },
        createArtistRef('test-metadata-provider', 'artist-2'),
      );
    });

    it("plays an artist's popular tracks in place of the queue", async () => {
      providersHost.register(
        MetadataProviderBuilder.socialStatsStyleProvider().build(),
      );
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack(async (artist: string, title: string) => [
            createMockCandidate(`candidate-${title}`, `${artist} - ${title}`),
          ])
          .build(),
      );

      await FavoriteArtistsWrapper.mount();
      await FavoriteArtistsWrapper.card(0).play();

      await vi.waitFor(() => {
        expect(PlayerBarWrapper.isPlaying).toBe(true);
      });
      expect(queuedTracks().map(stripResolutionState)).toEqual(
        deadmau5PopularTracks,
      );
      expect(FavoriteArtistsWrapper.view).toBeInTheDocument();
    });

    it("adds an artist's popular tracks to the queue", async () => {
      providersHost.register(
        MetadataProviderBuilder.socialStatsStyleProvider().build(),
      );

      await FavoriteArtistsWrapper.mount();
      await FavoriteArtistsWrapper.card(0).menu.addToQueue();

      await vi.waitFor(() => {
        expect(queuedTracks()).toEqual([
          existingTrack,
          ...deadmau5PopularTracks,
        ]);
      });
      expect(FavoriteArtistsWrapper.view).toBeInTheDocument();
    });

    it("tells you when the artist's popular tracks can't be loaded", async () => {
      providersHost.register(
        MetadataProviderBuilder.socialStatsStyleProvider()
          .withFetchArtistTopTracks(async () => {
            throw new Error('Service unavailable');
          })
          .build(),
      );

      await FavoriteArtistsWrapper.mount();
      await FavoriteArtistsWrapper.card(0).play();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          'Failed to load popular tracks.',
          { description: 'Service unavailable' },
        );
      });
      expect(queuedTracks()).toEqual([existingTrack]);
    });

    it('removes an artist from favorites', async () => {
      await FavoriteArtistsWrapper.mount();
      await FavoriteArtistsWrapper.card(0).menu.removeFromFavorites();

      expect(FavoriteArtistsWrapper.cardTitles).toEqual(['Artist artist-2']);
    });
  });
});
