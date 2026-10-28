import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { AlbumRef } from '@nuclearplayer/model';
import { createCardWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useStartupStore } from '../../stores/startupStore';

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

  async mount(): Promise<RenderResult> {
    useStartupStore.setState({ isStartingUp: false });
    const history = createMemoryHistory({
      initialEntries: ['/favorites/albums'],
    });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
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
