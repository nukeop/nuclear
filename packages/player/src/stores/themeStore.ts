import { create } from 'zustand';

import { clearAdvancedTheme, setThemeId } from '@nuclearplayer/themes';

import { setSetting, useSettingsStore } from './settingsStore';

export type AdvancedThemeFile = {
  id?: string;
  path: string;
  name: string;
};

export type BasicTheme = { type: 'basic'; id: string };
export type AdvancedTheme = { type: 'advanced'; path: string };
export type MarketplaceTheme = { type: 'marketplace'; id: string };

export type ActiveTheme = BasicTheme | AdvancedTheme | MarketplaceTheme;

const activeThemeId = (theme: ActiveTheme): string =>
  theme.type === 'advanced' ? theme.path : theme.id;

type ThemeStoreState = {
  advancedThemes: AdvancedThemeFile[];
  marketplaceThemes: AdvancedThemeFile[];
  activeTheme: ActiveTheme;

  setAdvancedThemes: (themes: AdvancedThemeFile[]) => void;
  setMarketplaceThemes: (themes: AdvancedThemeFile[]) => void;
  setActiveTheme: (theme: ActiveTheme) => void;
  selectTheme: (theme: ActiveTheme) => Promise<void>;
  selectBasicTheme: (id: string) => Promise<void>;
  resetTheme: () => Promise<void>;
  isSelected: (theme: ActiveTheme) => boolean;
  isBasicThemeSelected: () => boolean;
  isAdvancedThemeSelected: () => boolean;
  isMarketplaceThemeSelected: () => boolean;
  hydrate: () => void;
};

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  advancedThemes: [],
  marketplaceThemes: [],
  activeTheme: { type: 'basic', id: '' },

  setAdvancedThemes: (advancedThemes) => set({ advancedThemes }),
  setMarketplaceThemes: (marketplaceThemes) => set({ marketplaceThemes }),
  setActiveTheme: (activeTheme) => set({ activeTheme }),

  selectTheme: async (theme) => {
    set({ activeTheme: theme });
    await setSetting('core.theme.active.type', theme.type);
    await setSetting('core.theme.active.id', activeThemeId(theme));
  },

  selectBasicTheme: async (id) => {
    clearAdvancedTheme();
    setThemeId(id);
    await get().selectTheme({ type: 'basic', id });
  },

  resetTheme: async () => {
    clearAdvancedTheme();
    setThemeId('');
    await get().selectTheme({ type: 'basic', id: '' });
  },

  isSelected: (theme) => {
    const { activeTheme } = get();
    return (
      activeTheme.type === theme.type &&
      activeThemeId(activeTheme) === activeThemeId(theme)
    );
  },

  isBasicThemeSelected: () => get().activeTheme.type === 'basic',
  isAdvancedThemeSelected: () => get().activeTheme.type === 'advanced',
  isMarketplaceThemeSelected: () => get().activeTheme.type === 'marketplace',

  hydrate: () => {
    const settings = useSettingsStore.getState();
    const type = settings.getValue('core.theme.active.type');
    const id = settings.getValue('core.theme.active.id');

    if (typeof type !== 'string' || typeof id !== 'string' || !id) {
      return;
    }

    if (type === 'basic') {
      set({ activeTheme: { type: 'basic', id } });
      setThemeId(id);
    } else if (type === 'advanced') {
      set({ activeTheme: { type: 'advanced', path: id } });
    } else if (type === 'marketplace') {
      set({ activeTheme: { type: 'marketplace', id } });
    }
  },
}));
