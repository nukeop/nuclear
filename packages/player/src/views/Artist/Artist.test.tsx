import { stripResolutionState } from '@nuclearplayer/model';

import { PlayerBarWrapper } from '../../integration-tests/PlayerBar.test-wrapper';
import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useQueueStore } from '../../stores/queueStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import {
  createMockCandidate,
  StreamingProviderBuilder,
} from '../../test/builders/StreamingProviderBuilder';
import {
  GIANT_STEPS_REF,
  GIANT_STEPS_TRACKS,
} from '../../test/fixtures/albums';
import {
  BIO_BEATLES,
  SEARCH_RESULT,
  TOP_TRACKS_BEATLES,
} from '../../test/fixtures/artists';
import { createTrack } from '../../test/fixtures/queue';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { ArtistWrapper } from './Artist.test-wrapper';

const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: vi.fn(),
  },
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(async (command: string) => {
    if (command === 'stream_server_port') {
      return 9100;
    }
  }),
}));

const resetStores = () => {
  providersHost.clear();
  resetInMemoryTauriStore();
  useQueueStore.setState({ items: [], currentIndex: 0 });
  useFavoritesStore.setState({
    tracks: [],
    albums: [],
    artists: [],
    loaded: true,
  });
};

describe('Artist view', () => {
  describe('with bio provider', () => {
    beforeEach(() => {
      resetStores();
      providersHost.register(
        MetadataProviderBuilder.bioStyleProvider().build(),
      );
    });

    it('(Snapshot) renders the artist view', async () => {
      const component = await ArtistWrapper.mount('The Beatles');
      expect(component.asFragment()).toMatchSnapshot();
    });

    it('shows loading states for bio, top tracks, related artists, and albums', async () => {
      providersHost.clear();
      const delay = () => new Promise<never>(() => {});
      providersHost.register(
        MetadataProviderBuilder.bioStyleProvider()
          .withId('bio-never-resolves')
          .withFetchArtistBio(delay)
          .withFetchArtistAlbums(delay)
          .withFetchArtistTopTracks(delay)
          .withFetchArtistRelatedArtists(delay)
          .build(),
      );

      await ArtistWrapper.mountNoWait();

      expect(await ArtistWrapper.bioHeader.findSkeleton()).toBeInTheDocument();
      expect(await ArtistWrapper.albums.findSkeleton()).toBeInTheDocument();
      expect(
        await ArtistWrapper.popularTracks.findSkeleton(),
      ).toBeInTheDocument();
      expect(
        await ArtistWrapper.similarArtists.findSkeleton(),
      ).toBeInTheDocument();
    });

    it('adds artist to favorites when clicking the heart button', async () => {
      vi.setSystemTime(new Date('2026-01-30T12:00:00.000Z'));
      await ArtistWrapper.mount('The Beatles');
      await ArtistWrapper.toggleFavorite();

      expect(useFavoritesStore.getState().artists).toMatchSnapshot();
    });

    it('removes artist from favorites when clicking the heart button again', async () => {
      await ArtistWrapper.mount('The Beatles');
      await ArtistWrapper.toggleFavorite();
      await ArtistWrapper.toggleFavorite();

      expect(useFavoritesStore.getState().artists).toHaveLength(0);
    });

    it('only renders widgets for capabilities the provider declares', async () => {
      providersHost.clear();
      providersHost.register(
        new MetadataProviderBuilder()
          .withSearchCapabilities(['unified', 'artists'])
          .withArtistMetadataCapabilities(['artistBio', 'artistTopTracks'])
          .withSearch(async () => SEARCH_RESULT)
          .withFetchArtistBio(async () => BIO_BEATLES)
          .withFetchArtistTopTracks(async () => TOP_TRACKS_BEATLES)
          .build(),
      );

      await ArtistWrapper.mount('The Beatles');

      expect(ArtistWrapper.socialHeader.element).not.toBeInTheDocument();
      expect(ArtistWrapper.albums.skeleton).not.toBeInTheDocument();
      expect(ArtistWrapper.similarArtists.skeleton).not.toBeInTheDocument();
      expect(ArtistWrapper.albums.cards).toHaveLength(0);
    });

    describe('without opening an album', () => {
      const existingTrack = createTrack('Existing Track');

      const queuedTracks = () =>
        useQueueStore.getState().items.map((item) => item.track);

      beforeEach(() => {
        providersHost.clear();
        useQueueStore.getState().addToQueue([existingTrack]);
      });

      it('plays an album in place of the queue', async () => {
        providersHost.register(ArtistWrapper.fixtures.albumsProvider().build());
        providersHost.register(
          new StreamingProviderBuilder()
            .withSearchForTrack(async (artist: string, title: string) => [
              createMockCandidate(`candidate-${title}`, `${artist} - ${title}`),
            ])
            .build(),
        );

        await ArtistWrapper.mount('The Beatles');
        await ArtistWrapper.albums.card(0).play();

        await vi.waitFor(() => {
          expect(PlayerBarWrapper.isPlaying).toBe(true);
        });
        expect(queuedTracks().map(stripResolutionState)).toEqual(
          GIANT_STEPS_TRACKS,
        );
      });

      it('adds an album to the queue', async () => {
        providersHost.register(ArtistWrapper.fixtures.albumsProvider().build());

        await ArtistWrapper.mount('The Beatles');
        await ArtistWrapper.albums.card(0).menu.addToQueue();

        await vi.waitFor(() => {
          expect(queuedTracks()).toEqual([
            existingTrack,
            ...GIANT_STEPS_TRACKS,
          ]);
        });
      });

      it('shows that the album is loading until its tracks arrive', async () => {
        const provider = ArtistWrapper.registerSlowAlbumProvider();

        await ArtistWrapper.mount('The Beatles');
        await ArtistWrapper.albums.card(0).menu.addToQueue();

        expect(ArtistWrapper.albums.card(0).isLoading).toBe(true);
        provider.respond();
        await vi.waitFor(() => {
          expect(ArtistWrapper.albums.card(0).isLoading).toBe(false);
        });
      });

      it("tells you when the album's tracks can't be loaded", async () => {
        providersHost.register(
          ArtistWrapper.fixtures
            .albumsProvider()
            .withFetchAlbumDetails(async () => {
              throw new Error('Service unavailable');
            })
            .build(),
        );

        await ArtistWrapper.mount('The Beatles');
        await ArtistWrapper.albums.card(0).play();

        await vi.waitFor(() => {
          expect(toastError).toHaveBeenCalledWith('Failed to load tracks.', {
            description: 'Service unavailable',
          });
        });
        expect(queuedTracks()).toEqual([existingTrack]);
      });

      it('adds an album to favorites', async () => {
        providersHost.register(ArtistWrapper.fixtures.albumsProvider().build());

        await ArtistWrapper.mount('The Beatles');
        await ArtistWrapper.albums.card(0).menu.addToFavorites();

        expect(
          useFavoritesStore.getState().albums.map((entry) => entry.ref),
        ).toEqual([GIANT_STEPS_REF]);
      });

      it('removes an album from favorites', async () => {
        providersHost.register(ArtistWrapper.fixtures.albumsProvider().build());
        useFavoritesStore.setState({
          albums: [
            { ref: GIANT_STEPS_REF, addedAtIso: '2026-01-15T10:00:00.000Z' },
          ],
        });

        await ArtistWrapper.mount('The Beatles');
        await ArtistWrapper.albums.card(0).menu.removeFromFavorites();

        expect(useFavoritesStore.getState().albums).toEqual([]);
      });
    });
  });

  describe('with social stats provider', () => {
    beforeEach(() => {
      resetStores();
      providersHost.register(
        MetadataProviderBuilder.socialStatsStyleProvider().build(),
      );
    });

    it('(Snapshot) renders the artist view with social stats', async () => {
      const component = await ArtistWrapper.mount('Deadmau5');
      expect(component.asFragment()).toMatchSnapshot();
    });

    it('shows loading states for social stats, top tracks, playlists, and related artists', async () => {
      providersHost.clear();
      const delay = () => new Promise<never>(() => {});
      providersHost.register(
        MetadataProviderBuilder.socialStatsStyleProvider()
          .withId('social-never-resolves')
          .withFetchArtistSocialStats(delay)
          .withFetchArtistTopTracks(delay)
          .withFetchArtistPlaylists(delay)
          .withFetchArtistRelatedArtists(delay)
          .build(),
      );

      await ArtistWrapper.mountNoWait();

      expect(
        await ArtistWrapper.socialHeader.findSkeleton(),
      ).toBeInTheDocument();
      expect(
        await ArtistWrapper.popularTracks.findSkeleton(),
      ).toBeInTheDocument();
      expect(await ArtistWrapper.playlists.findSkeleton()).toBeInTheDocument();
      expect(
        await ArtistWrapper.similarArtists.findSkeleton(),
      ).toBeInTheDocument();
    });

    it('does not render bio header or albums grid', async () => {
      await ArtistWrapper.mount('Deadmau5');

      expect(ArtistWrapper.bioHeader.skeleton).not.toBeInTheDocument();
      expect(ArtistWrapper.albums.skeleton).not.toBeInTheDocument();
    });
  });
});
