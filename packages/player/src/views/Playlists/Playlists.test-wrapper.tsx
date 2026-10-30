import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import {
  cleanup,
  render,
  RenderResult,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { PlaylistProvider } from '@nuclearplayer/plugin-sdk';
import {
  createCardWrapper,
  createSelectWrapper,
  DialogWrapper,
} from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { playlistFileService } from '../../services/playlistFileService';
import { providersHost } from '../../services/providersHost';
import { usePlaylistStore } from '../../stores/playlistStore';
import { useStartupStore } from '../../stores/startupStore';
import type { PlaylistIndexBuilder } from '../../test/builders/PlaylistFolderBuilder';

const user = userEvent.setup();

const cardWidth = 168;
const cardHeight = 220;

const placeInRow = (element: HTMLElement, position: number) => {
  const left = position * cardWidth;
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    x: left,
    y: 0,
    left,
    top: 0,
    right: left + cardWidth,
    bottom: cardHeight,
    width: cardWidth,
    height: cardHeight,
    toJSON: () => ({}),
  });
};

const dragCardTo = async (name: string, targetName: string, dropX: number) => {
  screen.getAllByTestId('sortable-card').forEach(placeInRow);
  const from = PlaylistsWrapper.cardNames.indexOf(name);
  const to = PlaylistsWrapper.cardNames.indexOf(targetName);
  const clientY = cardHeight / 2;
  const startX = from * cardWidth + cardWidth / 2;

  await user.pointer([
    {
      keys: '[MouseLeft>]',
      target: screen.getAllByTestId('card-drag-handle')[from],
      coords: { clientX: startX, clientY },
    },
    { coords: { clientX: startX + 10, clientY } },
    { coords: { clientX: to * cardWidth + dropX, clientY } },
    { keys: '[/MouseLeft]' },
  ]);
  await new Promise((resolve) => setTimeout(resolve, 50));
};

export const PlaylistsWrapper = {
  createPlaylists(...builders: PlaylistIndexBuilder[]) {
    const playlists = builders.flatMap((builder) => builder.buildPlaylists());
    usePlaylistStore.setState({
      index: builders.map((builder) => builder.buildIndexNode()),
      playlists: new Map(playlists.map((p) => [p.id, p])),
      loaded: true,
    });
  },

  async savePlaylists(...builders: PlaylistIndexBuilder[]) {
    const playlists = builders.flatMap((builder) => builder.buildPlaylists());
    for (const playlist of playlists) {
      await playlistFileService.savePlaylist(playlist);
    }
    await playlistFileService.saveIndex(
      builders.map((builder) => builder.buildIndexNode()),
    );
    usePlaylistStore.setState({
      index: await playlistFileService.loadIndex(),
      playlists: new Map(),
      loaded: true,
    });
  },

  async mount(): Promise<RenderResult> {
    useStartupStore.setState({ isStartingUp: false });
    const history = createMemoryHistory({ initialEntries: ['/playlists'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('playlists-view');
    return component;
  },

  async restart(): Promise<RenderResult> {
    cleanup();
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: false,
    });
    await usePlaylistStore.getState().loadIndex();
    return PlaylistsWrapper.mount();
  },

  get title() {
    return screen.getByTestId('title').textContent;
  },

  backButton: {
    get element() {
      return screen.getByTestId('playlists-back-button');
    },
    async click() {
      await user.click(this.element);
    },
  },

  async goBack() {
    await PlaylistsWrapper.backButton.click();
  },

  newFolderButton: {
    get element() {
      return screen.queryByTestId('create-folder-button');
    },
    async click() {
      await user.click(screen.getByTestId('create-folder-button'));
    },
  },

  get folderNameInput(): HTMLInputElement {
    return screen.getByTestId('folder-name-input') as HTMLInputElement;
  },

  async createFolder(name: string) {
    await PlaylistsWrapper.newFolderButton.click();
    await user.type(PlaylistsWrapper.folderNameInput, name);
    await user.click(DialogWrapper.getByText('Create new'));
  },

  get folderNames() {
    return screen
      .getAllByTestId('folder-card')
      .map((folder) => within(folder).getByTestId('card-title').textContent);
  },

  folder(name: string) {
    const card = createCardWrapper(PlaylistsWrapper.cardNames.indexOf(name));

    return {
      get subtitle() {
        return card.subtitle;
      },
      open: () => card.click(),
      menu: {
        async openRenameDialog() {
          await card.openMenu();
          await user.click(screen.getByTestId('rename-folder-action'));
        },
        async rename(newName: string) {
          await this.openRenameDialog();
          await user.clear(PlaylistsWrapper.folderNameInput);
          await user.type(PlaylistsWrapper.folderNameInput, newName);
          await user.click(DialogWrapper.getByText('Save'));
        },
        async delete() {
          await card.openMenu();
          await user.click(screen.getByTestId('delete-folder-action'));
        },
      },
    };
  },

  get emptyState() {
    return screen.queryByTestId('empty-state');
  },
  get filterEmptyState() {
    return screen.queryByTestId('filter-empty-state');
  },
  filter: {
    get input() {
      return screen.queryByTestId('filter-playlists-input');
    },
    async type(text: string) {
      await user.type(screen.getByTestId('filter-playlists-input'), text);
    },
    async clear() {
      await user.clear(screen.getByTestId('filter-playlists-input'));
    },
  },
  get cards() {
    return screen.queryAllByTestId('card');
  },
  get cardNames() {
    return screen
      .getAllByTestId('card')
      .map((card) => within(card).getByTestId('card-title').textContent);
  },
  get draggableCardNames() {
    return screen
      .getAllByTestId('sortable-card')
      .filter((card) => within(card).queryByTestId('card-drag-handle'))
      .map((card) => within(card).getByTestId('card-title').textContent);
  },
  sort: {
    select: createSelectWrapper(() => screen.getByTestId('sort-playlists')),
    direction: {
      get element() {
        return screen.getByTestId('sort-direction-button');
      },
      async toggle() {
        await user.click(this.element);
      },
    },
  },
  card(index: number) {
    const card = createCardWrapper(index);

    return {
      get name() {
        return card.title;
      },
      get images() {
        return within(card.element).queryAllByRole('img');
      },
      get playButton() {
        return card.playButton;
      },
      click: () => card.click(),
      play: () => card.play(),
      menu: {
        async addToQueue() {
          await card.openMenu();
          await user.click(screen.getByTestId('add-to-queue-action'));
        },
        async exportJson() {
          await card.openMenu();
          await user.click(screen.getByTestId('export-json-action'));
        },
        async delete() {
          await card.openMenu();
          await user.click(screen.getByTestId('delete-playlist-action'));
        },
        async moveToFolder(folderName: string) {
          await card.openMenu();
          await user.click(screen.getByTestId('move-to-folder-action'));
          await user.click(DialogWrapper.getByText(folderName));
        },
        async removeFromFolder() {
          await card.openMenu();
          await user.click(screen.getByTestId('remove-from-folder-action'));
        },
      },
    };
  },
  deleteDialog: {
    async confirm() {
      await user.click(DialogWrapper.getByText('Delete'));
    },
    async cancel() {
      await DialogWrapper.cancelButton.click();
    },
  },
  async dragCard(name: string, targetName: string) {
    await dragCardTo(name, targetName, cardWidth / 2);
  },
  async dragCardToEdge(name: string, targetName: string) {
    await dragCardTo(name, targetName, 10);
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
