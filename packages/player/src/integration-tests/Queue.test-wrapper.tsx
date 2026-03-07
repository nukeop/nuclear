import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import {
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { QueueItem } from '@nuclearplayer/model';
import { DialogWrapper } from '@nuclearplayer/ui';

import App from '../App';
import { routeTree } from '../routeTree.gen';
import { usePlaylistStore } from '../stores/playlistStore';
import { useQueueStore } from '../stores/queueStore';
import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';

const user = userEvent.setup();

export const QueueWrapper = {
  seedQueue(items: QueueItem[]) {
    useQueueStore.setState({
      items,
      currentIndex: 0,
      isReady: true,
      isLoading: false,
    });
  },

  seedPlaylists(...builders: PlaylistBuilder[]) {
    const playlists = builders.map((builder) => builder.build());
    usePlaylistStore.setState({
      index: builders.map((builder) => builder.buildIndexEntry()),
      playlists: new Map(playlists.map((playlist) => [playlist.id, playlist])),
      loaded: true,
    });
  },

  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    const router = createRouter({ routeTree, history });
    const result = render(<App routerProp={router} />);
    await screen.findByTestId('sidebar-toggle-right');
    return result;
  },

  get items() {
    return screen.queryAllByTestId('queue-item');
  },

  get emptyState() {
    return screen.queryByTestId('queue-empty-state');
  },

  getItems() {
    const itemElements = screen.queryAllByTestId('queue-item');
    return itemElements.map((itemElement) => ({
      title: within(itemElement).getByTestId('queue-item-title').textContent,
      artist: within(itemElement).getByTestId('queue-item-artist').textContent,
      duration: within(itemElement).queryByTestId('queue-item-duration')
        ?.textContent,
      error: within(itemElement).queryByTestId('queue-item-error')?.textContent,
    }));
  },

  async waitForItems(count: number) {
    await waitFor(() => {
      const queueItems = screen.queryAllByTestId('queue-item');
      expect(queueItems).toHaveLength(count);
    });
  },

  getCurrentItemIndex() {
    const allTracks = screen.queryAllByTestId('queue-item');
    const currentTrackIndex = allTracks.findIndex(
      (item) => item.getAttribute('data-is-current') === 'true',
    );
    return currentTrackIndex;
  },

  async selectItem(title: string) {
    const queuePanel = await screen.findByTestId('queue-panel');
    const queueItems = await within(queuePanel).findAllByTestId('queue-item');
    const item = queueItems.find((itemElement) =>
      itemElement.textContent?.includes(title),
    );

    await userEvent.dblClick(item!);
  },

  async removeItemByTitle(title: string) {
    const allItems = screen.queryAllByTestId('queue-item');
    const item = allItems.find((itemElement) =>
      itemElement.textContent?.includes(title),
    );
    const removeButton = within(item!).getByTestId('queue-item-remove-button');
    await userEvent.click(removeButton);
  },

  clearButton: {
    get element() {
      return screen.getByTestId('clear-queue-button');
    },
    get query() {
      return screen.queryByTestId('clear-queue-button');
    },
    async click() {
      await user.click(this.element);
    },
  },

  moreButton: {
    get element() {
      return screen.getByTestId('queue-more-button');
    },
    get query() {
      return screen.queryByTestId('queue-more-button');
    },
    async click() {
      await user.click(this.element);
    },
  },

  moreMenu: {
    get saveAsPlaylistOption() {
      return screen.getByTestId('save-queue-as-playlist');
    },
    async clickSaveAsPlaylist() {
      await user.click(this.saveAsPlaylistOption);
    },
  },

  saveDialog: {
    isOpen: () => DialogWrapper.isOpen(),
    get nameInput() {
      return screen.getByTestId('save-queue-playlist-name-input');
    },
    async typeName(name: string) {
      await user.type(this.nameInput, name);
    },
    submitButton: {
      get element() {
        return DialogWrapper.getByText('Save');
      },
      async click() {
        await user.click(this.element);
      },
    },
    async saveAsPlaylist(name: string) {
      await QueueWrapper.saveDialog.typeName(name);
      await QueueWrapper.saveDialog.submitButton.click();
    },
  },
};
