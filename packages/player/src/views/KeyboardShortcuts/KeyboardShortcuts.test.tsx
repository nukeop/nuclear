import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { KeyboardShortcutsWrapper } from './KeyboardShortcuts.test-wrapper';

describe('Keyboard Shortcuts settings', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
  });

  it('shows the Playback and General section headings', async () => {
    await KeyboardShortcutsWrapper.mount();

    expect(
      KeyboardShortcutsWrapper.sectionHeading('Playback'),
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.sectionHeading('General'),
    ).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.sections).toHaveLength(2);
  });

  it('shows a row for each shortcut command', async () => {
    await KeyboardShortcutsWrapper.mount();

    expect(KeyboardShortcutsWrapper.row('Play / Pause')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Next track')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Previous track')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Seek forward')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Seek backward')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Volume up')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Volume down')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Mute / Unmute')).toBeInTheDocument();
    expect(KeyboardShortcutsWrapper.row('Open settings')).toBeInTheDocument();
  });
});
