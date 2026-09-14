import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { registerBuiltInCoreSettings } from '../services/coreSettings';
import { initializeSettingsStore } from '../stores/settingsStore';

const user = userEvent.setup();

const navigationSection = (sectionId: string) =>
  screen.getByTestId(`settings-navigation-section-${sectionId}`);

const navigationItem = (sectionId: string, itemId: string) => ({
  get element() {
    return within(navigationSection(sectionId)).getByTestId(
      `settings-navigation-item-${itemId}`,
    );
  },
  async click() {
    await user.click(this.element);
  },
});

export const ConnectedSettingsModalWrapper = {
  async mount(): Promise<RenderResult> {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();
    const component = render(<App />);
    await user.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    return component;
  },

  get generalSection() {
    return navigationSection('general');
  },

  get appSection() {
    return navigationSection('app');
  },

  category(id: string) {
    return navigationItem('general', id);
  },

  appTab(id: string) {
    return navigationItem('app', id);
  },

  get categoryLabels(): string[] {
    return within(this.generalSection)
      .getAllByRole('button')
      .map((element) => element.textContent!);
  },

  section(category: string) {
    return screen.getByTestId(`settings-section-${category}`);
  },

  viewTitle(title: string) {
    return screen.findByRole('heading', { name: title, level: 1 });
  },
};
