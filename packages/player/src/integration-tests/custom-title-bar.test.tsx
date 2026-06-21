import { screen } from '@testing-library/react';

import { useSettingsStore } from '../stores/settingsStore';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { CustomTitleBarWrapper } from './custom-title-bar.test-wrapper';

const mockWindow = vi.hoisted(() => ({
  minimize: vi.fn(),
  toggleMaximize: vi.fn(),
  close: vi.fn(),
  startDragging: vi.fn(),
  setDecorations: vi.fn(),
  setMinimizable: vi.fn(),
  isMaximized: vi.fn().mockResolvedValue(false),
}));

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => mockWindow,
}));

vi.mock(
  '../services/playlistFileService',
  async () =>
    (await import('../test/fixtures/playlists')).playlistFileServiceMock,
);

beforeEach(() => {
  vi.clearAllMocks();
  resetInMemoryTauriStore();
  useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
});

describe('Custom title bar', () => {
  it('title bar is hidden by default', async () => {
    await CustomTitleBarWrapper.mount();

    expect(CustomTitleBarWrapper.titleBar).not.toBeInTheDocument();
  });

  it('title bar appears when setting is enabled', async () => {
    await CustomTitleBarWrapper.mount();
    await CustomTitleBarWrapper.openSettings();
    await CustomTitleBarWrapper.customTitleBarToggle.click();

    expect(CustomTitleBarWrapper.titleBar).toBeInTheDocument();
    expect(screen.getByText('Nuclear Music Player')).toBeInTheDocument();
  });

  it('enabling custom title bar hides window decorations', async () => {
    await CustomTitleBarWrapper.mount();
    await CustomTitleBarWrapper.openSettings();
    await CustomTitleBarWrapper.customTitleBarToggle.click();

    expect(mockWindow.setDecorations).toHaveBeenCalledWith(false);
    expect(mockWindow.setMinimizable).toHaveBeenCalledWith(true);
  });

  it('shows macOS-style controls when titleBarStyle is set to macOS', async () => {
    await CustomTitleBarWrapper.mount();
    await CustomTitleBarWrapper.openSettings();
    await CustomTitleBarWrapper.customTitleBarToggle.click();
    await CustomTitleBarWrapper.titleBarStyleSelect.select('macOS');

    expect(CustomTitleBarWrapper.macWindowControls).toBeInTheDocument();
    expect(CustomTitleBarWrapper.windowsWindowControls).not.toBeInTheDocument();
  });

  it('shows Windows-style controls when titleBarStyle is set to Windows / Linux', async () => {
    await CustomTitleBarWrapper.mount();
    await CustomTitleBarWrapper.openSettings();
    await CustomTitleBarWrapper.customTitleBarToggle.click();
    await CustomTitleBarWrapper.titleBarStyleSelect.select('Windows / Linux');

    expect(CustomTitleBarWrapper.windowsWindowControls).toBeInTheDocument();
    expect(CustomTitleBarWrapper.macWindowControls).not.toBeInTheDocument();
  });

  it('clicking minimize calls Tauri minimize', async () => {
    await CustomTitleBarWrapper.mount();
    await CustomTitleBarWrapper.openSettings();
    await CustomTitleBarWrapper.customTitleBarToggle.click();
    await CustomTitleBarWrapper.titleBarStyleSelect.select('Windows / Linux');
    await CustomTitleBarWrapper.minimizeButton.click();

    expect(mockWindow.minimize).toHaveBeenCalledOnce();
  });

  it('clicking close calls Tauri close', async () => {
    await CustomTitleBarWrapper.mount();
    await CustomTitleBarWrapper.openSettings();
    await CustomTitleBarWrapper.customTitleBarToggle.click();
    await CustomTitleBarWrapper.titleBarStyleSelect.select('Windows / Linux');
    await CustomTitleBarWrapper.closeButton.click();

    expect(mockWindow.close).toHaveBeenCalledOnce();
  });

  it('title bar disappears when setting is disabled after being enabled', async () => {
    await CustomTitleBarWrapper.mount();
    await CustomTitleBarWrapper.openSettings();
    await CustomTitleBarWrapper.customTitleBarToggle.click();
    expect(CustomTitleBarWrapper.titleBar).toBeInTheDocument();

    await CustomTitleBarWrapper.customTitleBarToggle.click();
    expect(CustomTitleBarWrapper.titleBar).not.toBeInTheDocument();
  });
});
