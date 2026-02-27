import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { PlaylistProvider } from '@nuclearplayer/plugin-sdk';
import { DialogWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { usePlaylistStore } from '../../stores/playlistStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';

const user = userEvent.setup();

export const PlaylistsWrapper = {
  seedPlaylists(...builders: PlaylistBuilder[]) {
    const playlists = builders.map((b) => b.build());
    usePlaylistStore.setState({
      index: builders.map((b) => b.buildIndexEntry()),
      playlists: new Map(playlists.map((p) => [p.id, p])),
      loaded: true,
    });
  },

  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/playlists'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('playlists-view');
    return component;
  },

  get emptyState() {
    return screen.queryByTestId('empty-state');
  },
  get cards() {
    return screen.queryAllByTestId('card');
  },
  card(index: number) {
    return {
      get element() {
        return screen.getAllByTestId('card')[index];
      },
      get name() {
        return within(this.element).getByTestId('card-title').textContent;
      },
      async click() {
        await user.click(this.element);
      },
    };
  },
  get detailView() {
    return screen.queryByTestId('playlist-detail-view');
  },
  get importView() {
    return screen.queryByTestId('playlist-import-view');
  },

  createButton: {
    get element() {
      return screen.getByTestId('create-playlist-button');
    },
    async click() {
      await user.click(this.element);
    },
  },

  createDialog: {
    isOpen: () => DialogWrapper.isOpen(),
    get nameInput() {
      return screen.getByTestId('playlist-name-input');
    },
    async typeName(name: string) {
      await user.type(this.nameInput, name);
    },
    submitButton: {
      get element() {
        return DialogWrapper.getByText('Create new');
      },
      async click() {
        await user.click(this.element);
      },
    },
    async createPlaylist(name: string) {
      await PlaylistsWrapper.createDialog.typeName(name);
      await PlaylistsWrapper.createDialog.submitButton.click();
    },
  },

  import: {
    async openMenu() {
      await user.click(screen.getByTestId('import-playlist-button'));
    },
    fromJson: {
      async click() {
        await PlaylistsWrapper.import.openMenu();
        await user.click(screen.getByTestId('import-json-option'));
      },
    },
    fromUrl: {
      async click() {
        await PlaylistsWrapper.import.openMenu();
        await user.click(screen.getByTestId('import-url-option'));
      },
      dialog: {
        isOpen: () => DialogWrapper.isOpen(),
        async typeUrl(url: string) {
          await user.type(screen.getByTestId('import-url-input'), url);
        },
        async submit() {
          await user.click(DialogWrapper.getByText('Import from URL'));
        },
        async importFromUrl(url: string) {
          await PlaylistsWrapper.import.fromUrl.dialog.typeUrl(url);
          await PlaylistsWrapper.import.fromUrl.dialog.submit();
        },
        get submitButton() {
          return DialogWrapper.getByText('Import from URL');
        },
      },
    },
  },

  registerPlaylistProvider(provider: PlaylistProvider) {
    providersHost.register(provider);
  },

  clearProviders() {
    providersHost.clear();
  },
};
