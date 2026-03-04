import userEvent from '@testing-library/user-event';

import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { KeyboardShortcutsWrapper } from './KeyboardShortcuts.test-wrapper';

const user = userEvent.setup();

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

    expect(
      KeyboardShortcutsWrapper.row('Play / Pause').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Next track').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Previous track').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Seek forward').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Seek backward').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Volume up').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Volume down').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Mute / Unmute').element,
    ).toBeInTheDocument();
    expect(
      KeyboardShortcutsWrapper.row('Open settings').element,
    ).toBeInTheDocument();
  });

  it('shows the default keybinding for each command', async () => {
    await KeyboardShortcutsWrapper.mount();

    expect(KeyboardShortcutsWrapper.row('Play / Pause').keys).toEqual([
      'Space',
    ]);
    expect(KeyboardShortcutsWrapper.row('Next track').keys).toEqual([
      'Ctrl',
      '→',
    ]);
    expect(KeyboardShortcutsWrapper.row('Previous track').keys).toEqual([
      'Ctrl',
      '←',
    ]);
    expect(KeyboardShortcutsWrapper.row('Seek forward').keys).toEqual(['→']);
    expect(KeyboardShortcutsWrapper.row('Seek backward').keys).toEqual(['←']);
    expect(KeyboardShortcutsWrapper.row('Volume up').keys).toEqual([
      'Ctrl',
      '↑',
    ]);
    expect(KeyboardShortcutsWrapper.row('Volume down').keys).toEqual([
      'Ctrl',
      '↓',
    ]);
    expect(KeyboardShortcutsWrapper.row('Mute / Unmute').keys).toEqual([
      'Ctrl',
      'M',
    ]);
    expect(KeyboardShortcutsWrapper.row('Open settings').keys).toEqual([
      'Ctrl',
      ',',
    ]);
  });

  it('enters recording mode when clicking a keybinding', async () => {
    await KeyboardShortcutsWrapper.mount();

    await KeyboardShortcutsWrapper.row('Play / Pause').startRecording();

    expect(KeyboardShortcutsWrapper.row('Play / Pause').isRecording).toBe(true);
    expect(KeyboardShortcutsWrapper.recordingPrompt).toBeInTheDocument();
  });

  it('cancels recording when pressing Escape', async () => {
    await KeyboardShortcutsWrapper.mount();
    await KeyboardShortcutsWrapper.row('Play / Pause').startRecording();

    await user.keyboard('{Escape}');

    expect(KeyboardShortcutsWrapper.row('Play / Pause').isRecording).toBe(
      false,
    );
    expect(KeyboardShortcutsWrapper.row('Play / Pause').keys).toEqual([
      'Space',
    ]);
  });

  it('saves a new keybinding after recording', async () => {
    await KeyboardShortcutsWrapper.mount();
    await KeyboardShortcutsWrapper.row('Play / Pause').startRecording();

    await user.keyboard('{Control>}p{/Control}');

    expect(KeyboardShortcutsWrapper.row('Play / Pause').isRecording).toBe(
      false,
    );
    expect(KeyboardShortcutsWrapper.row('Play / Pause').keys).toEqual([
      'Ctrl',
      'P',
    ]);
  });

  it('shows a reset button only for overridden shortcuts', async () => {
    await KeyboardShortcutsWrapper.mount();

    expect(
      KeyboardShortcutsWrapper.row('Play / Pause').reset.element,
    ).not.toBeInTheDocument();

    await KeyboardShortcutsWrapper.row('Play / Pause').startRecording();
    await user.keyboard('{Control>}p{/Control}');

    expect(
      KeyboardShortcutsWrapper.row('Play / Pause').reset.element,
    ).toBeInTheDocument();
  });

  it('restores the default keybinding when clicking reset', async () => {
    await KeyboardShortcutsWrapper.mount();
    await KeyboardShortcutsWrapper.row('Play / Pause').startRecording();
    await user.keyboard('{Control>}p{/Control}');

    await KeyboardShortcutsWrapper.row('Play / Pause').reset.click();

    expect(KeyboardShortcutsWrapper.row('Play / Pause').keys).toEqual([
      'Space',
    ]);
    expect(
      KeyboardShortcutsWrapper.row('Play / Pause').reset.element,
    ).not.toBeInTheDocument();
  });
});
