import * as dialog from '@tauri-apps/plugin-dialog';
import * as fs from '@tauri-apps/plugin-fs';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type Mock } from 'vitest';

import { PlayerBarWrapper } from '../../integration-tests/PlayerBar.test-wrapper';
import { QueueWrapper } from '../../integration-tests/Queue.test-wrapper';
import { useQueueStore } from '../../stores/queueStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { mockUuid } from '../../test/utils/mockUuid';
import { PlaylistDetailWrapper } from './PlaylistDetail.test-wrapper';

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
  save: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
}));

const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: (...args: unknown[]) => toastSuccess(...args),
  },
}));

const defaultPlaylist = () =>
  new PlaylistBuilder()
    .withId('test-playlist')
    .withName('Test Playlist')
    .withTrackNames(['Giant Steps', 'So What']);

describe('PlaylistDetail view', () => {
  beforeEach(() => {
    mockUuid.reset();
    resetInMemoryTauriStore();
    useQueueStore.setState({ items: [], currentIndex: 0 });
    PlaylistDetailWrapper.seedPlaylist(defaultPlaylist());
    (dialog.save as Mock).mockResolvedValue(null);
    toastError.mockClear();
  });

  it('(Snapshot) renders playlist detail with tracks', async () => {
    const { getByTestId } = await PlaylistDetailWrapper.mount('test-playlist');

    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('displays the playlist name', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.title.display).toHaveTextContent(
      'Test Playlist',
    );
  });

  it('shows read-only badge for external playlists', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('external-playlist')
        .withName('External Playlist')
        .readOnly()
        .withOrigin({ provider: 'example-music', id: 'ext-1' })
        .withTrackNames(['Track A']),
    );

    await PlaylistDetailWrapper.mount('external-playlist');

    expect(PlaylistDetailWrapper.readOnlyBadge).toBeInTheDocument();
  });

  it('shows tooltip on read-only badge hover', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('external-playlist')
        .withName('External Playlist')
        .readOnly()
        .withOrigin({ provider: 'example-music', id: 'ext-1' })
        .withTrackNames(['Track A']),
    );

    await PlaylistDetailWrapper.mount('external-playlist');

    await userEvent.hover(screen.getByTestId('read-only-badge'));

    await vi.waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent(
        'This playlist is from example-music and is read-only. Save a local copy to edit it.',
      );
    });
  });

  it('deletes playlist and navigates back to playlists list', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    await PlaylistDetailWrapper.deleteDialog.openFromActions();
    expect(PlaylistDetailWrapper.deleteDialog.isOpen()).toBe(true);

    await PlaylistDetailWrapper.deleteDialog.confirmButton.click();

    await vi.waitFor(() => {
      expect(PlaylistDetailWrapper.playlistsListView).toBeInTheDocument();
    });
  });

  it('adds all tracks to queue and plays', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    await PlaylistDetailWrapper.playButton.click();

    const queueItems = QueueWrapper.getItems();
    expect(queueItems).toHaveLength(2);
    expect(queueItems[0]?.title).toBe('Giant Steps');
    expect(queueItems[1]?.title).toBe('So What');
    expect(PlayerBarWrapper.isPlaying).toBe(true);
  });

  it('shows empty state when playlist has no tracks', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder().withId('empty-playlist').withName('Empty Playlist'),
    );

    await PlaylistDetailWrapper.mount('empty-playlist');

    expect(PlaylistDetailWrapper.emptyState).toBeInTheDocument();
    expect(PlaylistDetailWrapper.trackTable).not.toBeInTheDocument();
  });

  it('removes a track from the playlist when clicking the delete button', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.trackTitle('Giant Steps')).toBeInTheDocument();
    expect(PlaylistDetailWrapper.trackTitle('So What')).toBeInTheDocument();
    expect(PlaylistDetailWrapper.removeButtons).toHaveLength(2);

    await PlaylistDetailWrapper.removeTrack('Giant Steps');

    await vi.waitFor(() => {
      expect(
        PlaylistDetailWrapper.trackTitle('Giant Steps'),
      ).not.toBeInTheDocument();
    });
    expect(PlaylistDetailWrapper.trackTitle('So What')).toBeInTheDocument();
  });

  it('does not show remove buttons for read-only playlists', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('readonly-playlist')
        .withName('Read-Only Playlist')
        .readOnly()
        .withOrigin({ provider: 'example-music', id: 'ext-1' })
        .withTrackNames(['Track A', 'Track B']),
    );

    await PlaylistDetailWrapper.mount('readonly-playlist');

    expect(PlaylistDetailWrapper.trackTable).toBeInTheDocument();
    expect(PlaylistDetailWrapper.removeButtons).toHaveLength(0);
  });

  it('enables reorder for editable playlists', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    const rows = screen.getAllByTestId('track-row');
    expect(rows[0]).toHaveAttribute('aria-disabled', 'false');
  });

  it('does not enable reorder for read-only playlists', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('readonly-playlist')
        .withName('Read-Only')
        .readOnly()
        .withOrigin({ provider: 'example-music', id: 'ext-1' })
        .withTrackNames(['Track A', 'Track B']),
    );

    await PlaylistDetailWrapper.mount('readonly-playlist');

    const rows = screen.getAllByTestId('track-row');
    expect(rows[0]).toHaveAttribute('aria-disabled', 'true');
  });

  it('adds all tracks to queue without clearing', async () => {
    useQueueStore.getState().addToQueue([
      {
        title: 'Existing Track',
        artists: [],
        source: { provider: 'test', id: 'existing' },
      },
    ]);

    await PlaylistDetailWrapper.mount('test-playlist');

    await PlaylistDetailWrapper.addToQueueFromActions();

    const queueItems = QueueWrapper.getItems();
    expect(queueItems).toHaveLength(3);
    expect(queueItems[0]?.title).toBe('Existing Track');
    expect(queueItems[1]?.title).toBe('Giant Steps');
    expect(queueItems[2]?.title).toBe('So What');
  });

  it('displays playlist artwork when available', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('art-playlist')
        .withName('Playlist With Art')
        .withArtwork('https://example.com/cover.jpg')
        .withTrackNames(['Track A']),
    );

    await PlaylistDetailWrapper.mount('art-playlist');

    const artwork = screen.getByTestId('playlist-artwork');
    expect(artwork).toBeInTheDocument();
    expect(artwork).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('renames the playlist via the edit button', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    await PlaylistDetailWrapper.editTitle('Renamed Playlist');

    await vi.waitFor(() => {
      expect(PlaylistDetailWrapper.title.display).toHaveTextContent(
        'Renamed Playlist',
      );
    });
  });

  it('does not show edit button for read-only playlists', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('readonly-playlist')
        .withName('Read-Only')
        .readOnly()
        .withOrigin({ provider: 'example-music', id: 'ext-1' })
        .withTrackNames(['Track A']),
    );

    await PlaylistDetailWrapper.mount('readonly-playlist');

    expect(PlaylistDetailWrapper.editButton.element).not.toBeInTheDocument();
  });

  it('edits the playlist description', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      defaultPlaylist().withDescription('Old description'),
    );

    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.description.display).toHaveTextContent(
      'Old description',
    );

    await PlaylistDetailWrapper.editDescription('New description');

    await vi.waitFor(() => {
      expect(PlaylistDetailWrapper.description.display).toHaveTextContent(
        'New description',
      );
    });
  });

  it('does not show description when empty', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.description.display).not.toBeInTheDocument();
  });

  describe('JSON export', () => {
    it('exports playlist as JSON file via save dialog', async () => {
      const expectedPath = '/downloads/Test Playlist.json';
      (dialog.save as Mock).mockResolvedValue(expectedPath);

      await PlaylistDetailWrapper.mount('test-playlist');
      await PlaylistDetailWrapper.exportJsonOption.click();

      expect(dialog.save).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultPath: 'Test Playlist.json',
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
        }),
      );

      expect(fs.writeTextFile).toHaveBeenCalledWith(
        expectedPath,
        expect.any(String),
      );

      const writtenJson = (fs.writeTextFile as Mock).mock.calls[0][1];
      const parsed = JSON.parse(writtenJson);
      expect(parsed.version).toBe(1);
      expect(parsed.playlist.name).toBe('Test Playlist');
      expect(parsed.playlist.items).toHaveLength(2);

      await vi.waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith('Playlist exported');
      });
    });

    it('does nothing when the user cancels the save dialog', async () => {
      (dialog.save as Mock).mockResolvedValueOnce(null);

      await PlaylistDetailWrapper.mount('test-playlist');
      await PlaylistDetailWrapper.exportJsonOption.click();

      expect(fs.writeTextFile).not.toHaveBeenCalled();
    });

    it('shows an error toast when writing the file fails', async () => {
      (dialog.save as Mock).mockResolvedValueOnce(
        '/downloads/Test Playlist.json',
      );
      (fs.writeTextFile as Mock).mockRejectedValueOnce(
        new Error('Permission denied'),
      );

      await PlaylistDetailWrapper.mount('test-playlist');
      await PlaylistDetailWrapper.exportJsonOption.click();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith('Failed to export playlist', {
          description: 'Permission denied',
        });
      });
    });

    it('shows an error toast when the save dialog fails', async () => {
      (dialog.save as Mock).mockRejectedValueOnce(
        new Error('Dialog unavailable'),
      );

      await PlaylistDetailWrapper.mount('test-playlist');
      await PlaylistDetailWrapper.exportJsonOption.click();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith('Failed to export playlist', {
          description: 'Dialog unavailable',
        });
      });
    });
  });
});
