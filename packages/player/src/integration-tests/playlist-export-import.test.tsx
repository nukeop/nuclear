import * as dialog from '@tauri-apps/plugin-dialog';
import * as fs from '@tauri-apps/plugin-fs';
import { type Mock } from 'vitest';

import { usePlaylistStore } from '../stores/playlistStore';
import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { mockUuid } from '../test/utils/mockUuid';
import { PlaylistDetailWrapper } from '../views/PlaylistDetail/PlaylistDetail.test-wrapper';
import { PlaylistsWrapper } from '../views/Playlists/Playlists.test-wrapper';

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
  save: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('Playlist export → import round trip', () => {
  beforeEach(() => {
    mockUuid.reset();
    resetInMemoryTauriStore();
  });

  it('exports a playlist and re-imports it with the same data', async () => {
    const originalPlaylist = new PlaylistBuilder()
      .withId('original-playlist')
      .withName('Jazz Classics')
      .withTrackNames(['Giant Steps', 'So What', 'Blue in Green']);

    PlaylistDetailWrapper.seedPlaylist(originalPlaylist);

    let capturedFileContent = '';
    (dialog.save as Mock).mockResolvedValueOnce('/fake/Jazz Classics.json');
    (fs.writeTextFile as Mock).mockImplementationOnce(
      (_path: string, content: string) => {
        capturedFileContent = content;
      },
    );

    const { unmount: unmountDetail } =
      await PlaylistDetailWrapper.mount('original-playlist');
    await PlaylistDetailWrapper.exportJsonOption.click();

    expect(capturedFileContent).not.toBe('');
    unmountDetail();

    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: true,
    });

    (dialog.open as Mock).mockResolvedValueOnce('/fake/Jazz Classics.json');
    (fs.readTextFile as Mock).mockResolvedValueOnce(capturedFileContent);

    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.import.fromJson.click();

    await vi.waitFor(() => {
      expect(PlaylistsWrapper.cards).toHaveLength(1);
    });
    expect(PlaylistsWrapper.card(0).name).toBe('Jazz Classics');

    await PlaylistsWrapper.card(0).click();
    await vi.waitFor(() => {
      expect(PlaylistDetailWrapper.title).toBeInTheDocument();
    });

    expect(PlaylistDetailWrapper.title).toHaveTextContent('Jazz Classics');
    expect(PlaylistDetailWrapper.trackCount).toHaveTextContent('3 tracks');
    expect(PlaylistDetailWrapper.trackTitle('Giant Steps')).toBeInTheDocument();
    expect(PlaylistDetailWrapper.trackTitle('So What')).toBeInTheDocument();
    expect(
      PlaylistDetailWrapper.trackTitle('Blue in Green'),
    ).toBeInTheDocument();
  });
});
