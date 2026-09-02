import { generateAdvancedThemeCSS } from './advanced/generator';
import { parseAdvancedTheme } from './advanced/parse';
import {
  AdvancedTheme,
  AdvancedThemeSchema,
  MarketplaceTheme,
  MarketplaceThemeRegistrySchema,
  MarketplaceThemeSchema,
} from './advanced/schema';
import { BUILTIN_BASIC_THEME_IDS, DEFAULT_THEME_ID } from './basic';

import './basic/aurora.css';
import './basic/ember.css';
import './basic/lagoon.css';
import './basic/arctic-moss.css';
import './basic/nebula.css';

export type BasicThemeMeta = {
  id: string;
  name: string;
  palette: [string, string, string, string];
};

const BUILT_INS: BasicThemeMeta[] = [
  {
    id: DEFAULT_THEME_ID,
    name: 'Default',
    palette: [
      'oklch(0.8 0.12 5)',
      'oklch(0.92 0.036 7)',
      'oklch(0.5 0.1 5)',
      'oklch(0.22 0.03 5)',
    ],
  },
  {
    id: 'nuclear:aurora',
    name: 'Aurora',
    palette: [
      'oklch(0.74 0.15 305)',
      'oklch(0.98 0.01 340)',
      'oklch(0.62 0.11 305)',
      'oklch(0.22 0.03 305)',
    ],
  },
  {
    id: 'nuclear:ember',
    name: 'Ember',
    palette: [
      'oklch(0.76 0.14 30)',
      'oklch(0.97 0.02 70)',
      'oklch(0.64 0.10 30)',
      'oklch(0.22 0.03 20)',
    ],
  },
  {
    id: 'nuclear:lagoon',
    name: 'Lagoon',
    palette: [
      'oklch(0.67 0.16 205)',
      'oklch(0.985 0.018 210)',
      'oklch(0.55 0.12 205)',
      'oklch(0.20 0.025 205)',
    ],
  },
  {
    id: 'nuclear:arctic-moss',
    name: 'Moss',
    palette: [
      'oklch(0.70 0.12 175)',
      'oklch(0.97 0.008 200)',
      'oklch(0.58 0.09 175)',
      'oklch(0.20 0.02 175)',
    ],
  },
  {
    id: 'nuclear:nebula',
    name: 'Nebula',
    palette: [
      'oklch(0.72 0.16 295)',
      'oklch(0.94 0.025 290)',
      'oklch(0.50 0.14 295)',
      'oklch(0.19 0.04 290)',
    ],
  },
];

export function listBasicThemes(): BasicThemeMeta[] {
  const allowed = new Set<string>(BUILTIN_BASIC_THEME_IDS as readonly string[]);
  return BUILT_INS.filter((t) => allowed.has(t.id));
}

export function setThemeId(id: string): void {
  const root = document.documentElement;
  root.setAttribute('data-theme-id', id);
}

export function setBasicTheme(id: string): void {
  setThemeId(id);
}

const ADV_STYLE_ID = 'advanced-theme';

export function applyAdvancedTheme(theme: AdvancedTheme): void {
  const parsed = AdvancedThemeSchema.parse(theme);
  const css = generateAdvancedThemeCSS(parsed);
  let style = document.getElementById(ADV_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = ADV_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

export function clearAdvancedTheme(): void {
  const style = document.getElementById(ADV_STYLE_ID);
  if (style?.parentNode) {
    style.parentNode.removeChild(style);
  }
}

export type { AdvancedTheme, MarketplaceTheme };
export {
  AdvancedThemeSchema,
  BUILTIN_BASIC_THEME_IDS,
  DEFAULT_THEME_ID,
  MarketplaceThemeRegistrySchema,
  MarketplaceThemeSchema,
};
export { parseAdvancedTheme };
