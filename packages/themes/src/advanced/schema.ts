import { z } from 'zod';

export const ThemeVersion = z.literal(1);

// Keys correspond to CSS custom properties in global.css without the leading --
// Example: background, primary, radius, font-family, etc.
export const ThemeVars = z
  .record(z.string(), z.string())
  .refine((obj) => Object.keys(obj).every((k) => !!k && !k.startsWith('--')), {
    message: 'Keys must be CSS var names without leading --',
  });

export const AdvancedThemeSchema = z
  .object({
    version: ThemeVersion,
    name: z.string().min(1),
    vars: ThemeVars.optional(),
    dark: ThemeVars.optional(),
  })
  .strict();

export type AdvancedTheme = z.infer<typeof AdvancedThemeSchema>;

export const parseAdvancedTheme = (input: unknown): AdvancedTheme =>
  AdvancedThemeSchema.parse(input);
