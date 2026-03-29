import {
  AdvancedThemeSchema,
  ThemeRegistrySchema,
} from '@nuclearplayer/themes';

import { ApiClient } from './ApiClient';

class ThemeRegistryApi extends ApiClient {
  constructor() {
    super(
      'https://raw.githubusercontent.com/NuclearPlayer/theme-registry/master',
    );
  }

  async getThemes() {
    const registry = await this.fetch('/themes.json', ThemeRegistrySchema);
    return registry.themes;
  }

  async getThemeFile(path: string) {
    return this.fetch(`/${path}`, AdvancedThemeSchema);
  }
}

export const themeRegistryApi = new ThemeRegistryApi();
