import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Album, AlbumRef } from '@nuclearplayer/model';
import { createCardWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useStartupStore } from '../../stores/startupStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { GIANT_STEPS } from '../../test/fixtures/albums';

const user = userEvent.setup();

const newestFirst = (index: number) =>
  new Date(Date.UTC(2026, 0, 15 - index)).toISOString();

export const FavoriteAlbumsWrapper = {
  addFavorites(...refs: AlbumRef[]) {
    useFavoritesStore.setState({
      albums: refs.map((ref, index) => ({
        ref,
        addedAtIso: newestFirst(index),
      })),
      loaded: true,
    });
  },

  registerSlowProvider() {
    const response = Promise.withResolvers<Album>();
    providersHost.register(
      MetadataProviderBuilder.albumDetailsProvider()
        .withFetchAlbumDetails(() => response.promise)
        .build(),
    );
    return {
      respond: () => response.resolve(GIANT_STEPS),
    };
  },

  async mount(): Promise<RenderResult> {
    useStartupStore.setState({ isStartingUp: false });
    const history = createMemoryHistory({
      initialEntries: ['/favorites/albums'],
    });
    const router = createRouter({ routeTree, history });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const component = render(
      <App queryClientProp={queryClient} routerProp={router} />,
    );
    await screen.findByTestId('favorite-albums-view');
    return component;
  },

  get view() {
    return screen.getByTestId('favorite-albums-view');
  },

  get cardTitles() {
    return screen
      .getAllByTestId('card-container')
      .map((_, index) => createCardWrapper(index).title);
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
        async removeFromFavorites() {
          await card.openMenu();
          await user.click(screen.getByTestId('remove-favorite-action'));
        },
      },
    };
  },
};
