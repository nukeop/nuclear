import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

export const PluginsWrapper = {
  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    await userEvent.click(
      await component.findByRole('button', {
        name: 'Plugins',
      }),
    );
    await screen.findByRole('heading', { name: 'Plugins' });

    return component;
  },
  async goToStoreTab(): Promise<void> {
    await userEvent.click(screen.getByRole('tab', { name: 'Store' }));
  },
  async goToInstalledTab(): Promise<void> {
    await userEvent.click(screen.getByRole('tab', { name: 'Installed' }));
  },
  getPlugins: () => {
    return screen
      .queryAllByTestId('plugin-item')
      .map((item) => new PluginItemWrapper(item));
  },
  getStorePlugins: () => {
    return screen
      .queryAllByTestId('plugin-store-item')
      .map((item) => new PluginStoreItemWrapper(item));
  },
  async searchStore(query: string): Promise<void> {
    const input = screen.getByPlaceholderText('Search plugins...');
    await userEvent.clear(input);
    await userEvent.type(input, query);
  },
  async selectCategory(category: string): Promise<void> {
    const chip = screen.getByRole('radio', { name: category });
    await userEvent.click(chip);
  },
};

class PluginItemWrapper {
  constructor(private element: HTMLElement) {}

  get name() {
    return within(this.element).getByTestId('plugin-name').textContent;
  }

  get author() {
    return within(this.element).getByTestId('plugin-author').textContent;
  }

  get description() {
    return within(this.element).getByTestId('plugin-description').textContent;
  }

  get enabled() {
    return (
      within(this.element).getByRole('switch').getAttribute('data-enabled') ===
      'true'
    );
  }

  toggle = async () => {
    await userEvent.click(within(this.element).getByRole('switch'));
  };
}

class PluginStoreItemWrapper {
  constructor(private element: HTMLElement) {}

  get name() {
    return within(this.element).getByTestId('plugin-store-item-name')
      .textContent;
  }

  get author() {
    return within(this.element).getByTestId('plugin-store-item-author')
      .textContent;
  }

  get description() {
    return within(this.element).getByTestId('plugin-store-item-description')
      .textContent;
  }

  get installButton() {
    return within(this.element).getByRole('button');
  }

  get isInstalled() {
    return this.installButton.textContent?.includes('Installed') ?? false;
  }

  get isInstalling() {
    return this.installButton.textContent?.includes('Installing') ?? false;
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
