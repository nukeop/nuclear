import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Track } from '@nuclearplayer/model';

import { usePlaylistStore } from '../stores/playlistStore';
import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';
import { ConnectedTrackContextMenu } from './ConnectedTrackContextMenu';

const user = userEvent.setup();

const defaultTrack: Track = {
  title: 'Test Track',
  artists: [
    {
      name: 'Test Artist',
      roles: [],
      source: { provider: 'test', id: 'a1' },
    },
  ],
  durationMs: 200000,
  source: { provider: 'test', id: 't1' },
};

export const ConnectedTrackContextMenuWrapper = {
  createPlaylists(...builders: PlaylistBuilder[]) {
    const playlists = builders.map((b) => b.build());
    usePlaylistStore.setState({
      index: builders.map((builder) => builder.buildIndexEntry()),
      playlists: new Map(playlists.map((playlist) => [playlist.id, playlist])),
      loaded: true,
    });
  },

  mount(track: Track = defaultTrack): RenderResult {
    return render(
      <ConnectedTrackContextMenu track={track}>
        <button>Open</button>
      </ConnectedTrackContextMenu>,
    );
  },

  async open() {
    await user.click(screen.getByText('Open'));
  },

  action(label: string) {
    return {
      get element() {
        return screen.getByText(label);
      },
      async click() {
        await user.click(this.element);
      },
    };
  },

  submenu: {
    get trigger() {
      return screen.queryByTestId('submenu-trigger');
    },
    async open() {
      await user.click(screen.getByTestId('submenu-trigger'));
    },
    get panel() {
      return screen.getByTestId('submenu-content');
    },
    item(name: string) {
      return {
        get element() {
          return screen.getByText(name);
        },
        async click() {
          return userEvent.click(this.element);
        },
      };
    },
    get filterInput() {
      return screen.queryByTestId('playlist-filter-input');
    },
    async filter(text: string) {
      const input = screen.getByTestId('playlist-filter-input');
      fireEvent.change(input, { target: { value: text } });
    },
    get items() {
      return screen.getAllByTestId('playlist-submenu-item');
    },
  },
};
