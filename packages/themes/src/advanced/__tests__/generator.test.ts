import { describe, expect, it } from 'vitest';

import { generateAdvancedThemeCSS } from '../../advanced/generator';

describe('generateAdvancedThemeCSS', () => {
  it('produces CSS for light and dark vars', () => {
    const css = generateAdvancedThemeCSS({
      version: 2,
      name: 'Test',
      vars: {
        background: 'oklch(98% 0 0)',
        primary: 'oklch(70% 0.1 250)',
      },
      dark: {
        background: 'oklch(40% 0.03 277)',
        primary: 'oklch(70% 0.1 250)',
      },
    });

    expect(css).toMatchInlineSnapshot(`
":root{--background: oklch(98% 0 0); --primary: oklch(70% 0.1 250);}\n[data-theme='dark']{--background: oklch(40% 0.03 277); --primary: oklch(70% 0.1 250);}"`);
  });

  it('handles partial themes and trims whitespace', () => {
    const css = generateAdvancedThemeCSS({
      version: 2,
      name: 'Partial',
      vars: { radius: ' 10px  ' },
    });

    expect(css).toMatchInlineSnapshot(`
":root{--radius: 10px;}"`);
  });
});
