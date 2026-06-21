import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { routeTree } from '../routeTree.gen';
import { registerBuiltInCoreSettings } from '../services/coreSettings';
import { initializeSettingsStore } from '../stores/settingsStore';

const user = userEvent.setup();

export const CustomTitleBarWrapper = {
  async mount(): Promise<RenderResult> {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    const router = createRouter({ routeTree, history });
    const result = render(<App routerProp={router} />);
    await screen.findByTestId('player-workspace-main');
    return result;
  },

  async openSettings() {
    await user.click(
      await screen.findByRole('button', { name: 'Preferences' }),
    );
    await user.click(await screen.findByRole('button', { name: 'General' }));
    await screen.findByRole('heading', { name: 'General', level: 1 });
  },

  get titleBar() {
    return screen.queryByTestId('title-bar');
  },

  get macWindowControls() {
    return screen.queryByTestId('mac-window-controls');
  },

  get windowsWindowControls() {
    return screen.queryByTestId('windows-window-controls');
  },

  customTitleBarToggle: {
    get element() {
      return screen.getByRole('switch', { name: 'Custom title bar' });
    },
    async click() {
      await user.click(this.element);
    },
  },

  titleBarStyleSelect: {
    async select(optionLabel: string) {
      const button = screen.getByRole('button', { name: /Title bar style/i });
      await user.click(button);
      await user.click(
        await screen.findByRole('option', { name: optionLabel }),
      );
    },
  },

  minimizeButton: {
    get element() {
      return screen.getByTitle('Minimize');
    },
    async click() {
      await user.click(this.element);
    },
  },

  closeButton: {
    get element() {
      return screen.getByTitle('Close');
    },
    async click() {
      await user.click(this.element);
    },
  },
};
