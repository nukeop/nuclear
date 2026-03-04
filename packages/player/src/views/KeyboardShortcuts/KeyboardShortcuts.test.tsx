import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { KeyboardShortcutsWrapper } from './KeyboardShortcuts.test-wrapper';

describe('Keyboard Shortcuts settings', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
  });

  it('shows the Playback and General section headings', async () => {
    await KeyboardShortcutsWrapper.mount();
  });
});
