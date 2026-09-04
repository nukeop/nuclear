import { z } from 'zod';

// Keys correspond to CSS custom properties in global.css without the leading --
// Example: background, primary, radius, font-family, etc.
export const ThemeVars = z.record(
  z.string().regex(/^[a-z0-9][a-z0-9-]*$/, {
    message: 'Keys must be lowercase CSS var names without the leading --',
  }),
  z.string().refine((value) => !/[{};]/.test(value), {
    message: 'Values must not contain {, }, or ;',
  }),
);

export const AdvancedThemeSchema = z.object({
  version: z.literal(2),
  name: z.string().min(1),
  author: z.string().min(1).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  palette: z.tuple([z.string(), z.string(), z.string(), z.string()]).optional(),
  vars: ThemeVars.optional(),
  dark: ThemeVars.optional(),
});

export type AdvancedTheme = z.infer<typeof AdvancedThemeSchema>;

export const V1AdvancedThemeSchema = AdvancedThemeSchema.extend({
  version: z.literal(1),
});

export type V1AdvancedTheme = z.infer<typeof V1AdvancedThemeSchema>;

export const MarketplaceThemeSchema = AdvancedThemeSchema.pick({
  name: true,
  author: true,
  description: true,
  tags: true,
  palette: true,
})
  .required({ author: true, description: true, palette: true })
  .extend({
    id: z.string().min(1),
    path: z.string().min(1),
  });

export type MarketplaceTheme = z.infer<typeof MarketplaceThemeSchema>;

export const MarketplaceThemeRegistrySchema = z.object({
  version: z.number(),
  themes: z.array(MarketplaceThemeSchema),
});
