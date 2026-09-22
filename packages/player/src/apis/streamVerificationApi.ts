import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import type { Track } from '@nuclearplayer/model';

import { Logger } from '../services/logger';
import { providersHost } from '../services/providersHost';
import { getSetting, useSettingsStore } from '../stores/settingsStore';

const TopStreamSchema = z
  .object({
    stream_id: z.string(),
    score: z.number(),
    self_verified: z.boolean().default(false),
  })
  .transform((wire) => ({
    streamId: wire.stream_id,
    score: wire.score,
    selfVerified: wire.self_verified,
  }));

export type TopStream = z.infer<typeof TopStreamSchema>;

type TrackKey = {
  artist: string;
  title: string;
  source: string;
  author_id: string;
};

type StreamMapping = TrackKey & {
  stream_id: string;
};

type SuccessCacheEntry = {
  type: 'success';
  value: TopStream;
  timestamp: number;
};

type ErrorCacheEntry = {
  type: 'error';
  status: number;
  timestamp: number;
};

export type StreamCacheEntry = SuccessCacheEntry | ErrorCacheEntry;

export const isSuccessCacheEntry = (
  entry: StreamCacheEntry,
): entry is SuccessCacheEntry => entry.type === 'success';

const CACHE_TTL_MS = 5 * 60 * 1000;

class StreamVerificationApi {
  private topStreamCache = new Map<string, StreamCacheEntry>();

  async getTopStream(track: Track): Promise<StreamCacheEntry> {
    const key = this.keyFor(track);
    const cacheKey = this.cacheKey(key);
    const cached = this.topStreamCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached;
    }

    const response = await this.request('POST', '/mappings/top', key);
    if (response.ok) {
      return this.cache(cacheKey, {
        type: 'success',
        value: TopStreamSchema.parse(await response.json()),
        timestamp: Date.now(),
      });
    }

    return this.cache(cacheKey, {
      type: 'error',
      status: response.status,
      timestamp: Date.now(),
    });
  }

  async postStreamMapping(track: Track): Promise<void> {
    const mapping = this.mappingFor(track);
    const response = await this.request('PUT', '/mappings', mapping);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    this.topStreamCache.delete(this.cacheKey(mapping));
  }

  async deleteStreamMapping(track: Track): Promise<void> {
    const mapping = this.mappingFor(track);
    const response = await this.request('DELETE', '/mappings', mapping);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    this.topStreamCache.delete(this.cacheKey(mapping));
  }

  clearCache(): void {
    this.topStreamCache.clear();
  }

  private cache(cacheKey: string, entry: StreamCacheEntry): StreamCacheEntry {
    this.topStreamCache.set(cacheKey, entry);
    return entry;
  }

  private async request(
    method: string,
    path: string,
    body: TrackKey,
  ): Promise<Response> {
    const url = `https://nuclear-tritone.fly.dev${path}`;
    Logger.http.debug(`${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok || response.status === 404) {
      Logger.http.debug(`${method} ${url} -> ${response.status}`);
    } else {
      Logger.http.warn(`${method} ${url} -> ${response.status}`);
    }

    return response;
  }

  private keyFor(track: Track): TrackKey {
    const source = providersHost.getActive('streaming');
    if (!source) {
      throw new Error('No streaming provider is active');
    }

    return {
      artist: track.artists[0]?.name ?? '',
      title: track.title,
      source,
      author_id: this.authorId(),
    };
  }

  private mappingFor(track: Track): StreamMapping {
    const headCandidate = track.streamCandidates?.[0];
    if (!headCandidate) {
      throw new Error('Track has no stream candidate');
    }

    return { ...this.keyFor(track), stream_id: headCandidate.id };
  }

  private authorId(): string {
    const stored = getSetting('core.streamVerification.authorId') as string;
    if (stored) {
      return stored;
    }

    const generated = uuid();
    useSettingsStore
      .getState()
      .setValue('core.streamVerification.authorId', generated);
    return generated;
  }

  private cacheKey(key: TrackKey): string {
    return `${key.artist}:${key.title}:${key.source}`;
  }
}

export const streamVerificationApi = new StreamVerificationApi();
