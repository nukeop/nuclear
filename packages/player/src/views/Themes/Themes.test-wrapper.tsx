import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import {
  AdvancedThemeFile,
  useAdvancedThemeStore,
} from '../../stores/advancedThemeStore';

export const ThemesWrapper = {
  async mount(opts?: {
    advancedThemes?: AdvancedThemeFile[];
  }): Promise<RenderResult> {
    if (opts?.advancedThemes) {
      useAdvancedThemeStore.getState().setThemes(opts.advancedThemes);
    }
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    await userEvent.click(
      await component.findByRole('button', {
        name: 'Themes',
      }),
    );
    return component;
  },
  async getAdvancedTheme(name: string | RegExp) {
    const section = await screen.findByTestId('advanced-themes');
    return within(section).getByRole('option', { name });
  },
  async openAdvancedThemeSelect() {
    const section = await screen.findByTestId('advanced-themes');
    const trigger = within(section).getByRole('button');
    await userEvent.click(trigger);
    return section;
  },
  async selectAdvancedTheme(label: string) {
    const section = await this.openAdvancedThemeSelect();
    const labelElement = within(section).getByRole('option', { name: label });
    await userEvent.click(labelElement);
  },
  async selectDefaultTheme() {
    await this.selectAdvancedTheme('Default');
  },
};
