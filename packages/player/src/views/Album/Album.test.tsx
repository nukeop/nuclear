import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useQueueStore } from '../../stores/queueStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { AlbumWrapper } from './Album.test-wrapper';

describe('Album view', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-30T12:00:00.000Z'));
    providersHost.clear();
    resetInMemoryTauriStore();
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: true,
    });
    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['unified', 'albums'])
      .withAlbumMetadataCapabilities(['albumDetails'])
      .withSearch(async () => ({
        albums: [
          {
            title: 'Test Album',
            artists: [
              {
                name: 'Test Artist',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            artwork: {
              items: [
                {
                  url: 'https://img/album-cover.jpg',
                  purpose: 'cover',
                  width: 600,
                },
              ],
            },
            source: {
              provider: 'test-metadata-provider',
              id: 'test-album-id',
            },
          },
        ],
      }))
      .withFetchAlbumDetails(async () => ({
        title: 'Prism',
        artists: [
          {
            name: 'John Butler',
            roles: [],
          },
        ],
        tracks: [
          {
            title: 'Going Solo',
            artists: [
              {
                name: 'John Butler',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            source: {
              provider: 'test-metadata-provider',
              id: 'track-1',
            },
          },
          {
            title: 'King of California',
            artists: [
              {
                name: 'John Butler',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            source: {
              provider: 'test-metadata-provider',
              id: 'track-2',
            },
          },
        ],
        releaseDate: {
          precision: 'year',
          dateIso: '2025-01-01',
        },
        genres: ['Folk', 'World', 'Country'],
        artwork: {
          items: [
            {
              url: 'https://img/album-cover.jpg',
              purpose: 'cover',
              width: 600,
            },
          ],
        },
        source: {
          provider: 'test-metadata-provider',
          id: 'test-album-id',
        },
      }))
      .build();

    providersHost.register(provider);
  });

  it('(Snapshot) renders the album view', async () => {
    const component = await AlbumWrapper.mount('Prism');
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('shows loading states for album details and tracks', async () => {
    providersHost.clear();
    const delay = () => {
      return new Promise<never>(() => {});
    };
    const provider = new MetadataProviderBuilder()
      .withId('query-cache-busted')
      .withName('The provider that never resolves')
      .withSearchCapabilities(['unified', 'albums'])
      .withAlbumMetadataCapabilities(['albumDetails'])
      .withSearch(async () => ({
        albums: [
          {
            title: 'Test Album',
            artists: [
              {
                name: 'Test Artist',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            source: {
              provider: 'test-metadata-provider',
              id: 'test-album-id',
            },
          },
        ],
      }))
      .withFetchAlbumDetails(delay)
      .build();
    providersHost.register(provider);

    await AlbumWrapper.mountNoWait();

    expect(await AlbumWrapper.headerLoader.find()).toBeInTheDocument();
    expect(await AlbumWrapper.tracksLoader.find()).toBeInTheDocument();
  });

  it('adds album to favorites when clicking the heart button', async () => {
    await AlbumWrapper.mount('Prism');

    expect(await AlbumWrapper.favoriteButton.ariaLabel()).toBe(
      'Add to favorites',
    );

    await AlbumWrapper.favoriteButton.click();

    expect(await AlbumWrapper.favoriteButton.ariaLabel()).toBe(
      'Remove from favorites',
    );
  });

  it('removes album from favorites when clicking the heart button again', async () => {
    await AlbumWrapper.mount('Prism');
    await AlbumWrapper.favoriteButton.click();
    await AlbumWrapper.favoriteButton.click();

    expect(await AlbumWrapper.favoriteButton.ariaLabel()).toBe(
      'Add to favorites',
    );
  });

  describe('Track context menu', () => {
    beforeEach(() => {
      useQueueStore.getState().clearQueue();
    });

    it('opens track context menu when clicking menu button', async () => {
      await AlbumWrapper.mount('Prism');
      await AlbumWrapper.openTrackContextMenu('Going Solo');

      expect(AlbumWrapper.contextMenu.getItem('Play now')).toBeInTheDocument();
      expect(AlbumWrapper.contextMenu.getItem('Play next')).toBeInTheDocument();
      expect(
        AlbumWrapper.contextMenu.getItem('Add to queue'),
      ).toBeInTheDocument();
      expect(
        AlbumWrapper.contextMenu.getItem('Add to favorites'),
      ).toBeInTheDocument();
    });

    it('adds track to favorites via context menu', async () => {
      await AlbumWrapper.mount('Prism');
      await AlbumWrapper.toggleTrackFavoriteViaContextMenu('Going Solo');

      expect(AlbumWrapper.trackFavoriteButton('Going Solo')).toHaveAttribute(
        'aria-label',
        'Remove from favorites',
      );
    });

    it('removes track from favorites via context menu', async () => {
      await AlbumWrapper.mount('Prism');
      await AlbumWrapper.toggleTrackFavoriteViaContextMenu('Going Solo');
      await AlbumWrapper.toggleTrackFavoriteViaContextMenu('Going Solo');

      expect(AlbumWrapper.trackFavoriteButton('Going Solo')).toHaveAttribute(
        'aria-label',
        'Add to favorites',
      );
    });

    it('adds track to queue via context menu', async () => {
      await AlbumWrapper.mount('Prism');
      await AlbumWrapper.addTrackToQueueViaContextMenu('Going Solo');

      const thumbnail = await AlbumWrapper.findQueueItemThumbnail();
      expect(thumbnail).toHaveAttribute('src', 'https://img/album-cover.jpg');
      expect(thumbnail).toHaveAttribute('alt', 'Going Solo');
    });
  });
});
