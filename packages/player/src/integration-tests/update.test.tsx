import { relaunch } from '@tauri-apps/plugin-process';
import { screen } from '@testing-library/react';

import { useSettingsStore } from '../stores/settingsStore';
import { useUpdaterStore } from '../stores/updaterStore';
import { UpdateWrapper } from './Update.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

vi.mock('@tauri-apps/plugin-updater', () => ({
  check: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-process', () => ({
  relaunch: vi.fn(),
}));

vi.mock(
  '../services/playlistFileService',
  async () =>
    (await import('../test/fixtures/playlists')).playlistFileServiceMock,
);

beforeEach(() => {
  useUpdaterStore.setState({
    isUpdateAvailable: false,
    updateInfo: null,
    lastChecked: null,
    isChecking: false,
    isDownloading: false,
    isInstalling: false,
    isReadyToRestart: false,
    downloadProgress: 0,
    error: null,
  });

  useSettingsStore.setState({
    values: {},
    definitions: {},
    loaded: true,
  });
});

describe('Update badge', () => {
  it('does not show update badge when no update is available', async () => {
    await UpdateWrapper.mount();

    expect(UpdateWrapper.badge.element).not.toBeInTheDocument();
  });

  it('shows "Click to update" when update is available in manual mode', async () => {
    UpdateWrapper.seedUpdateAvailable();
    UpdateWrapper.setAutoInstall(false);

    await UpdateWrapper.mount();

    expect(screen.getByText('Click to update')).toBeInTheDocument();
  });

  it('shows "Update available" when update is available in auto-install mode', async () => {
    UpdateWrapper.seedUpdateAvailable();
    UpdateWrapper.setAutoInstall(true);

    await UpdateWrapper.mount();

    expect(screen.getByText('Update available')).toBeInTheDocument();
  });

  it('downloads update and shows restart prompt when clicking the badge', async () => {
    UpdateWrapper.seedUpdateAvailable({ downloadBehavior: 'immediate' });
    UpdateWrapper.setAutoInstall(false);

    await UpdateWrapper.mount();
    await UpdateWrapper.badge.click();

    expect(useUpdaterStore.getState().isReadyToRestart).toBe(true);
    expect(screen.getByText('Click to restart')).toBeInTheDocument();
  });

  it('shows download progress', async () => {
    UpdateWrapper.seedDownloading(42);

    await UpdateWrapper.mount();

    expect(screen.getByText('Downloading... 42%')).toBeInTheDocument();
  });

  it('calls relaunch when clicking restart badge', async () => {
    UpdateWrapper.seedReadyToRestart();

    await UpdateWrapper.mount();
    await UpdateWrapper.badge.click();

    expect(relaunch).toHaveBeenCalledOnce();
  });
});
