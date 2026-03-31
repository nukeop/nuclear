import { QueryClient } from '@tanstack/react-query';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DEFAULT_THEME_ID } from '@nuclearplayer/themes';
import { createSelectWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import {
  useThemeStore,
  type ActiveTheme,
  type AdvancedThemeFile,
} from '../../stores/themeStore';
import {
  SAKURA_THEME_FILE,
  THEME_REGISTRY_RESPONSE,
} from '../../test/fixtures/themeRegistry';
import { FetchMock } from '../../test/mocks/fetch';
import { PluginFsMock } from '../../test/mocks/plugin-fs';

const REGISTRY_BASE_URL =
  'https://cdn.jsdelivr.net/gh/NuclearPlayer/theme-registry@master';

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

  get isActive() {
    return (
      within(this.element)
        .getByTestId('theme-store-item-apply')
        .textContent?.includes('Active') ?? false
    );
  }

  get isInstalled() {
    return (
      within(this.element)
        .getByRole('button')
        .textContent?.includes('Installed') ?? false
    );
  }

  get data() {
    return {
      name: this.name,
      author: this.author,
      description: this.description,
      isInstalled: this.isInstalled,
    };
  }

  get installButton() {
    const container = this.element;
    return {
      get element() {
        return within(container).getByTestId('theme-store-item-install');
      },
      async click() {
        await userEvent.click(this.element);
      },
    };
  }

  get applyButton() {
    const container = this.element;
    return {
      get element() {
        return within(container).queryByTestId('theme-store-item-apply');
      },
      async click() {
        await userEvent.click(this.element!);
      },
    };
  }
}

export const ThemesWrapper = {
  async mount(opts?: {
    advancedThemes?: AdvancedThemeFile[];
    marketplaceThemes?: AdvancedThemeFile[];
    activeTheme?: ActiveTheme;
  }): Promise<RenderResult> {
    useThemeStore.setState({
      ...(opts?.advancedThemes !== undefined && {
        advancedThemes: opts.advancedThemes,
      }),
      marketplaceThemes: opts?.marketplaceThemes ?? [],
      activeTheme: opts?.activeTheme ?? { type: 'basic', id: DEFAULT_THEME_ID },
    });
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
  get activeBasicTheme() {
    const section = screen.getByTestId('basic-themes');
    const active = within(section).queryByRole('button', { pressed: true });
    return active?.textContent?.trim() ?? null;
  },

  advancedThemeSelect: createSelectWrapper(() =>
    screen.getByTestId('advanced-themes'),
  ),

  get marketplaceThemeSelect() {
    const section = screen.queryByTestId('marketplace-themes');
    if (!section) {
      return null;
    }
    return createSelectWrapper(() => section);
  },

  async selectBasicTheme(name: string) {
    const section = screen.getByTestId('basic-themes');
    const button = within(section).getByRole('button', { name });
    await userEvent.click(button);
  },

  async goToStoreTab() {
    await userEvent.click(screen.getByRole('tab', { name: 'Store' }));
  },

  async goToMyThemesTab() {
    await userEvent.click(screen.getByRole('tab', { name: 'My themes' }));
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

  async mountWithMarketplaceTheme(opts?: {
    advancedThemes?: AdvancedThemeFile[];
  }) {
    this.setupStoreIndex();
    PluginFsMock.setReadTextFile(JSON.stringify(SAKURA_THEME_FILE));
    return this.mount({
      ...opts,
      marketplaceThemes: [
        { id: 'sakura', name: 'Sakura', path: 'themes/store/sakura.json' },
      ],
    });
  },

  async installTheme(name: string) {
    const theme = await this.getStoreTheme(name);
    await theme.installButton.click();
  },

  async applyMarketplaceTheme(name: string) {
    await this.goToStoreTab();
    const theme = await this.getStoreTheme(name);
    await theme.applyButton.click();
    await this.goToMyThemesTab();
  },

  setupStoreIndex() {
    FetchMock.init();
    FetchMock.get(`${REGISTRY_BASE_URL}/themes.json`, THEME_REGISTRY_RESPONSE);
  },

  setupThemeFile(id: string) {
    FetchMock.get(`${REGISTRY_BASE_URL}/themes/${id}.json`, SAKURA_THEME_FILE);
  },

  setupThemeFileError(id: string, status: number, statusText: string) {
    FetchMock.getError(
      `${REGISTRY_BASE_URL}/themes/${id}.json`,
      status,
      statusText,
    );
  },

  setupStoreIndexError(status: number, statusText: string) {
    FetchMock.init();
    FetchMock.getError(`${REGISTRY_BASE_URL}/themes.json`, status, statusText);
  },
};
