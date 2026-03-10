import { LazyStore } from '@tauri-apps/plugin-store';
import type { z } from 'zod';

import { reportError } from '../utils/logging';
import type { LogScope } from './logger';

export const loadValidated = async <S extends z.ZodType>(
  store: LazyStore,
  key: string,
  schema: S,
  domain: LogScope,
): Promise<z.output<S> | null> => {
  const raw = await store.get<unknown>(key);
  if (raw == null) {
    return null;
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    await reportError(domain, {
      userMessage: `${domain} data is corrupted`,
      error: result.error,
    });
    return null;
  }
  return result.data;
};
