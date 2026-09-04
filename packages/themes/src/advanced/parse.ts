import { z } from 'zod';

import { migrateV1ToV2 } from './migrate';
import {
  AdvancedTheme,
  AdvancedThemeSchema,
  V1AdvancedThemeSchema,
} from './schema';

const AnyVersionAdvancedThemeSchema = z.union([
  V1AdvancedThemeSchema.transform(migrateV1ToV2),
  AdvancedThemeSchema,
]);

export const parseAdvancedTheme = (
  input: unknown,
): AdvancedTheme | undefined => {
  const result = AnyVersionAdvancedThemeSchema.safeParse(input);
  if (!result.success) {
    return undefined;
  }
  return result.data;
};
