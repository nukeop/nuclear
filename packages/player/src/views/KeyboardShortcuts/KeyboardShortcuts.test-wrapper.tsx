import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { initializeSettingsStore } from '../../stores/settingsStore';

const user = userEvent.setup();

export const KeyboardShortcutsWrapper = {
  async mount(): Promise<RenderResult> {
    await initializeSettingsStore();
    const component = render(<App />);
    await user.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    await user.click(await screen.findByTestId('settings-tab-shortcuts'));
    await screen.findByRole('heading', {
      name: 'Keyboard Shortcuts',
      level: 1,
    });

    return component;
  },

  get sections() {
    return screen.queryAllByTestId(/^shortcut-section-/);
  },

  sectionHeading(sectionName: string) {
    return screen.queryByRole('heading', { name: sectionName, level: 2 });
  },

  row(label: string) {
    return screen.queryByRole('row', { name: new RegExp(label) });
  },
};
