import { create } from 'zustand';

export type AdvancedThemeFile = {
  id?: string;
  path: string;
  name: string;
};

export type ActiveTheme =
  | { type: 'basic'; id: string }
  | { type: 'advanced'; path: string }
  | { type: 'marketplace'; id: string };

type ThemeStoreState = {
  advancedThemes: AdvancedThemeFile[];
  marketplaceThemes: AdvancedThemeFile[];
  activeTheme: ActiveTheme;

  setAdvancedThemes: (themes: AdvancedThemeFile[]) => void;
  setMarketplaceThemes: (themes: AdvancedThemeFile[]) => void;
  setActiveTheme: (theme: ActiveTheme) => void;
};

export const useThemeStore = create<ThemeStoreState>((set) => ({
  advancedThemes: [],
  marketplaceThemes: [],
  activeTheme: { type: 'basic', id: '' },

  setAdvancedThemes: (advancedThemes) => set({ advancedThemes }),
  setMarketplaceThemes: (marketplaceThemes) => set({ marketplaceThemes }),
  setActiveTheme: (activeTheme) => set({ activeTheme }),
}));
