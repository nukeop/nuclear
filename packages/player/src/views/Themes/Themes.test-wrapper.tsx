import { QueryClient } from '@tanstack/react-query';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { AdvancedThemeFile, useThemeStore } from '../../stores/themeStore';

class ThemeStoreItemWrapper {
  constructor(private element: HTMLElement) {}

  get name() {
    return within(this.element).getByTestId('theme-store-item-name')
      .textContent;
  }

  get author() {
    return within(this.element).getByTestId('theme-store-item-author')
      .textContent;
  }

  get description() {
    return within(this.element).getByTestId('theme-store-item-description')
      .textContent;
  }

  get installButton() {
    return within(this.element).getByRole('button');
  }

  get isInstalled() {
    return this.installButton.textContent?.includes('Installed') ?? false;
  }

  get data() {
    return {
      name: this.name,
      author: this.author,
      description: this.description,
      isInstalled: this.isInstalled,
    };
  }

  install = async () => {
    await userEvent.click(this.installButton);
  };
}

export const ThemesWrapper = {
  async mount(opts?: {
    advancedThemes?: AdvancedThemeFile[];
    marketplaceThemes?: AdvancedThemeFile[];
  }): Promise<RenderResult> {
    if (opts?.advancedThemes) {
      useThemeStore.getState().setAdvancedThemes(opts.advancedThemes);
    }
    if (opts?.marketplaceThemes) {
      useThemeStore.getState().setMarketplaceThemes(opts.marketplaceThemes);
    }
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const component = render(<App queryClientProp={queryClient} />);
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

  async goToStoreTab() {
    await userEvent.click(screen.getByRole('tab', { name: 'Store' }));
  },

  async goToLocalTab() {
    await userEvent.click(screen.getByRole('tab', { name: 'Local' }));
  },

  async getStoreThemes() {
    const items = await screen.findAllByTestId('theme-store-item');
    return items.map((element) => new ThemeStoreItemWrapper(element));
  },

  async getStoreTheme(name: string) {
    const themes = await this.getStoreThemes();
    return themes.find((theme) => theme.name === name)!;
  },

  get storeThemeNames() {
    return screen
      .queryAllByTestId('theme-store-item')
      .map(
        (element) =>
          within(element).getByTestId('theme-store-item-name').textContent,
      );
  },

  async searchStore(query: string) {
    const input = screen.getByPlaceholderText('Search themes...');
    await userEvent.clear(input);
    await userEvent.type(input, query);
  },

  get storeErrorState() {
    return screen.findByTestId('theme-store-error');
  },
};
