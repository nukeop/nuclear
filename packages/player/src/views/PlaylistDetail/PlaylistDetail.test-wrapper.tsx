import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DialogWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { usePlaylistStore } from '../../stores/playlistStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';

const user = userEvent.setup();

export const PlaylistDetailWrapper = {
  seedPlaylist(builder: PlaylistBuilder) {
    const playlist = builder.build();
    usePlaylistStore.setState({
      index: [builder.buildIndexEntry()],
      playlists: new Map([[playlist.id, playlist]]),
      loaded: true,
    });
  },

  async mount(playlistId: string): Promise<RenderResult> {
    const history = createMemoryHistory({
      initialEntries: [`/playlists/${playlistId}`],
    });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('playlist-detail-view');
    return component;
  },

  title: {
    get display() {
      return screen.getByTestId('playlist-detail-title-display');
    },
    get input() {
      return screen.queryByTestId('playlist-detail-title-input');
    },
    async click() {
      await user.click(this.display);
    },
    async edit(newValue: string) {
      await user.click(this.display);
      const input = screen.getByTestId('playlist-detail-title-input');
      await user.clear(input);
      await user.type(input, newValue);
      await user.keyboard('{Enter}');
    },
  },

  description: {
    get display() {
      return screen.getByTestId('playlist-detail-description-display');
    },
    get input() {
      return screen.queryByTestId('playlist-detail-description-input');
    },
    async click() {
      await user.click(this.display);
    },
    async edit(newValue: string) {
      await user.click(this.display);
      const input = screen.getByTestId('playlist-detail-description-input');
      await user.clear(input);
      await user.type(input, newValue);
      await user.tab();
    },
  },

  get trackCount() {
    return screen.queryByTestId('playlist-detail-track-count');
  },
  get trackTable() {
    return screen.queryByRole('table');
  },
  trackTitle(name: string) {
    return screen.queryByText(name);
  },
  get readOnlyBadge() {
    return screen.queryByTestId('read-only-badge');
  },
  get emptyState() {
    return screen.queryByTestId('empty-state');
  },
  get artwork() {
    return screen.queryByTestId('playlist-artwork');
  },

  actionsButton: {
    get element() {
      return screen.getByTestId('playlist-actions-button');
    },
    async click() {
      await user.click(this.element);
    },
  },

  exportJsonOption: {
    get element() {
      return screen.getByTestId('export-json-action');
    },
    async click() {
      await PlaylistDetailWrapper.actionsButton.click();
      await user.click(this.element);
    },
  },

  deleteDialog: {
    isOpen: () => DialogWrapper.isOpen(),
    async openFromActions() {
      await PlaylistDetailWrapper.actionsButton.click();
      await user.click(screen.getByTestId('delete-playlist-action'));
    },
    confirmButton: {
      get element() {
        return DialogWrapper.getByText('Delete');
      },
      async click() {
        await user.click(this.element);
      },
    },
  },

  playButton: {
    get element() {
      return screen.getByTestId('play-all-button');
    },
    async click() {
      await user.click(this.element);
    },
  },

  async addToQueueFromActions() {
    await PlaylistDetailWrapper.actionsButton.click();
    await user.click(screen.getByTestId('add-to-queue-action'));
  },

  get playlistsListView() {
    return screen.queryByTestId('playlists-view');
  },

  get removeButtons() {
    return screen.queryAllByLabelText('Remove from list');
  },

  async removeTrack(trackTitle: string) {
    const row = screen
      .getAllByTestId('track-row')
      .find((r) => r.textContent?.includes(trackTitle))!;
    await user.click(within(row).getByLabelText('Remove from list'));
  },
};
