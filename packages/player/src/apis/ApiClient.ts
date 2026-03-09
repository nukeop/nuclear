import { z } from 'zod';

import { Logger } from '../services/logger';

export class ApiClient {
  constructor(protected readonly baseUrl: string) {}

  protected async fetch<T>(path: string, schema: z.ZodType<T>): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    Logger.http.debug(`GET ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      Logger.http.warn(`GET ${url} -> ${response.status}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    Logger.http.debug(`GET ${url} -> ${response.status}`);

    const json = await response.json();

    try {
      return schema.parse(json);
    } catch (error) {
      if (error instanceof z.ZodError) {
        Logger.http.error(
          `Schema validation failed for ${url}: ${error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`,
        );
      }
      throw error;
    }
  }
}
