import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { registerBuiltInCoreSettings } from '../../services/coreSettings';
import { initializeSettingsStore } from '../../stores/settingsStore';

export const SettingsWrapper = {
  async mount(): Promise<RenderResult> {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    await userEvent.click(
      await component.findByRole('button', {
        name: 'General',
      }),
    );
    await screen.findByRole('heading', { name: 'General', level: 1 });

    return component;
  },
};
