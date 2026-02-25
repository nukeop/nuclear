import { vi } from 'vitest';

import { registerBuiltInCoreSettings } from '../../services/coreSettings';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { SettingsWrapper } from './Settings.test-wrapper';

window.scrollTo = vi.fn();

describe('Settings view', async () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    registerBuiltInCoreSettings();
  });
  it('(Snapshot) renders the settings view', async () => {
    const { getByRole } = await SettingsWrapper.mount();
    expect(getByRole('dialog')).toMatchSnapshot();
  });
});
