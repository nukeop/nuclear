import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import {
  BIO_BEATLES,
  SEARCH_RESULT,
  TOP_TRACKS_BEATLES,
} from '../../test/fixtures/artists';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { ArtistWrapper } from './Artist.test-wrapper';

const resetStores = () => {
  providersHost.clear();
  resetInMemoryTauriStore();
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

      expect(await ArtistWrapper.bioHeader.findLoader()).toBeInTheDocument();
      expect(await ArtistWrapper.albums.findSkeleton()).toBeInTheDocument();
      expect(
        await ArtistWrapper.popularTracks.findSkeleton(),
      ).toBeInTheDocument();
      expect(
        await ArtistWrapper.similarArtists.findLoader(),
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
      expect(ArtistWrapper.similarArtists.loader).not.toBeInTheDocument();
      expect(ArtistWrapper.albums.cards).toHaveLength(0);
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

      expect(await ArtistWrapper.socialHeader.findLoader()).toBeInTheDocument();
      expect(
        await ArtistWrapper.popularTracks.findSkeleton(),
      ).toBeInTheDocument();
      expect(await ArtistWrapper.playlists.findSkeleton()).toBeInTheDocument();
      expect(
        await ArtistWrapper.similarArtists.findLoader(),
      ).toBeInTheDocument();
    });

    it('does not render bio header or albums grid', async () => {
      await ArtistWrapper.mount('Deadmau5');

      expect(ArtistWrapper.bioHeader.loader).not.toBeInTheDocument();
      expect(ArtistWrapper.albums.skeleton).not.toBeInTheDocument();
    });
  });
});
