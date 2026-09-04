import { describe, expect, it } from 'vitest';

import {
  applyAdvancedTheme,
  clearAdvancedTheme,
  setBasicTheme,
  setThemeId,
} from '../index';

describe('runtime API', () => {
  it('sets data-theme-id via setThemeId', () => {
    setThemeId('nuclear:aurora');
    expect(document.documentElement.getAttribute('data-theme-id')).toBe(
      'nuclear:aurora',
    );
  });

  it('sets data-theme-id via setBasicTheme', () => {
    setBasicTheme('nuclear:ember');
    expect(document.documentElement.getAttribute('data-theme-id')).toBe(
      'nuclear:ember',
    );
  });

  it('injects and clears advanced theme style', () => {
    applyAdvancedTheme({ version: 2, name: 'X', vars: { radius: '10px' } });
    const style = document.getElementById('advanced-theme');
    expect(style).toBeTruthy();
    expect(style?.textContent).toMatchInlineSnapshot(`
":root{--radius: 10px;}"`);

    clearAdvancedTheme();
    expect(document.getElementById('advanced-theme')).toBeNull();
  });
});
