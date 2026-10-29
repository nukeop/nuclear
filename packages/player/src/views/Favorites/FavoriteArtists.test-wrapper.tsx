import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ArtistRef, TrackRef } from '@nuclearplayer/model';
import { createCardWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useStartupStore } from '../../stores/startupStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { TOP_TRACKS_DEADMAU5 } from '../../test/fixtures/artists';

const user = userEvent.setup();

const newestFirst = (index: number) =>
  new Date(Date.UTC(2026, 0, 15 - index)).toISOString();

export const FavoriteArtistsWrapper = {
  addFavorites(...refs: ArtistRef[]) {
    useFavoritesStore.setState({
      artists: refs.map((ref, index) => ({
        ref,
        addedAtIso: newestFirst(index),
      })),
      loaded: true,
    });
  },

  registerSlowProvider() {
    const response = Promise.withResolvers<TrackRef[]>();
    providersHost.register(
      MetadataProviderBuilder.socialStatsStyleProvider()
        .withFetchArtistTopTracks(() => response.promise)
        .build(),
    );
    return {
      respond: () => response.resolve(TOP_TRACKS_DEADMAU5),
    };
  },

  async mount(): Promise<RenderResult> {
    useStartupStore.setState({ isStartingUp: false });
    const history = createMemoryHistory({
      initialEntries: ['/favorites/artists'],
    });
    const router = createRouter({ routeTree, history });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const component = render(
      <App queryClientProp={queryClient} routerProp={router} />,
    );
    await screen.findByTestId('favorite-artists-view');
    return component;
  },

  get view() {
    return screen.getByTestId('favorite-artists-view');
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
