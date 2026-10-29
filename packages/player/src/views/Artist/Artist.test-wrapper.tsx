import { RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Album } from '@nuclearplayer/model';
import { createCardWrapper } from '@nuclearplayer/ui';

import { providersHost } from '../../services/providersHost';
import { useStartupStore } from '../../stores/startupStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { GIANT_STEPS, GIANT_STEPS_REF } from '../../test/fixtures/albums';
import { SearchWrapper } from '../Search/Search.test-wrapper';

const user = userEvent.setup();

export const ArtistWrapper = {
  async mount(header: string): Promise<RenderResult> {
    useStartupStore.setState({ isStartingUp: false });
    const component = await SearchWrapper.mount('test artist');
    await ArtistWrapper.openArtistFromSearch();
    await screen.findByRole('heading', {
      name: new RegExp(header),
    });
    return component;
  },
  async mountNoWait(): Promise<RenderResult> {
    useStartupStore.setState({ isStartingUp: false });
    const component = await SearchWrapper.mount('test artist');
    await ArtistWrapper.openArtistFromSearch();
    await new Promise((resolve) => setTimeout(resolve, 0));
    return component;
  },
  async openArtistFromSearch() {
    const searchView = screen.getByTestId('search-view');
    await user.click(await within(searchView).findByText('Test Artist'));
  },

  getHeader: (name: string) => screen.getByRole('heading', { name }),

  bioHeader: {
    get skeleton() {
      return screen.queryByTestId('artist-header-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-header-skeleton');
    },
  },

  socialHeader: {
    get element() {
      return screen.queryByTestId('artist-social-header');
    },
    get skeleton() {
      return screen.queryByTestId('artist-social-header-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-social-header-skeleton');
    },
  },

  popularTracks: {
    get heading() {
      return screen.getByRole('heading', { name: /popular tracks/i });
    },
    get table() {
      return screen.queryByRole('table');
    },
    get skeleton() {
      return screen.queryByTestId('popular-tracks-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('popular-tracks-skeleton');
    },
  },

  similarArtists: {
    get heading() {
      return screen.getByRole('heading', { name: /similar artists/i });
    },
    get items() {
      return screen.queryAllByRole('listitem');
    },
    get skeleton() {
      return screen.queryByTestId('similar-artists-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('similar-artists-skeleton');
    },
    inspectItem(listItem: HTMLElement) {
      const utils = within(listItem);
      return {
        img: utils.queryByRole('img'),
        name: utils.getByText(/.+/),
      };
    },
  },

  fixtures: {
    albumsProvider() {
      return MetadataProviderBuilder.bioStyleProvider()
        .withFetchArtistAlbums(async () => [GIANT_STEPS_REF])
        .withFetchAlbumDetails(async () => GIANT_STEPS);
    },
  },

  registerSlowAlbumProvider() {
    const response = Promise.withResolvers<Album>();
    providersHost.register(
      ArtistWrapper.fixtures
        .albumsProvider()
        .withFetchAlbumDetails(() => response.promise)
        .build(),
    );
    return {
      respond: () => response.resolve(GIANT_STEPS),
    };
  },

  albums: {
    get cards() {
      return screen.queryAllByTestId('card');
    },
    card(index: number) {
      const card = createCardWrapper(index);

      return {
        get isLoading() {
          return card.isLoading;
        },
        play: () => card.play(),
        menu: {
          async addToQueue() {
            await card.openMenu();
            await user.click(screen.getByTestId('add-to-queue-action'));
          },
          async addToFavorites() {
            await card.openMenu();
            await user.click(screen.getByTestId('add-favorite-action'));
          },
          async removeFromFavorites() {
            await card.openMenu();
            await user.click(screen.getByTestId('remove-favorite-action'));
          },
        },
      };
    },
    get skeleton() {
      return screen.queryByTestId('artist-albums-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-albums-skeleton');
    },
  },

  playlists: {
    get skeleton() {
      return screen.queryByTestId('artist-playlists-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-playlists-skeleton');
    },
  },

  async toggleFavorite() {
    const button = await screen.findByTestId('artist-favorite-button');
    await user.click(button);
  },
};
