import { Duration } from 'luxon';
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

type MappingRequest = {
  artist: string;
  title: string;
  source: string;
  author_id: string;
  stream_id?: string;
};

class StreamVerificationApi {
  private topStreamCache = new Map<
    string,
    { topStream?: TopStream; timestamp: number }
  >();

  constructor(
    private readonly baseUrl: string,
    private readonly cacheTtlMs: number,
  ) {}

  async getTopStream(track: Track): Promise<TopStream | undefined> {
    const cacheKey = this.verificationKey(track);
    const cached = this.topStreamCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.topStream;
    }

    const response = await this.request(
      'POST',
      '/mappings/top',
      this.keyFor(track),
    );
    if (!response.ok) {
      return this.cache(cacheKey, undefined);
    }

    return this.cache(cacheKey, TopStreamSchema.parse(await response.json()));
  }

  async postStreamMapping(track: Track): Promise<void> {
    await this.writeMapping('PUT', track);
  }

  async deleteStreamMapping(track: Track): Promise<void> {
    await this.writeMapping('DELETE', track);
  }

  clearCache(): void {
    this.topStreamCache.clear();
  }

  verificationKey(track: Track): string {
    const { artist, title, source } = this.identify(track);
    return `${artist}:${title}:${source}`;
  }

  private cache(
    cacheKey: string,
    topStream: TopStream | undefined,
  ): TopStream | undefined {
    this.topStreamCache.set(cacheKey, { topStream, timestamp: Date.now() });
    return topStream;
  }

  private async writeMapping(method: string, track: Track): Promise<void> {
    const headCandidate = track.streamCandidates?.[0];
    if (!headCandidate) {
      throw new Error('Track has no stream candidate');
    }

    const response = await this.request(method, '/mappings', {
      ...this.keyFor(track),
      stream_id: headCandidate.id,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    this.topStreamCache.delete(this.verificationKey(track));
  }

  private async request(
    method: string,
    path: string,
    body: MappingRequest,
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
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

  private identify(track: Track) {
    const source = providersHost.getActive('streaming');
    if (!source) {
      throw new Error('No streaming provider is active');
    }

    return {
      artist: track.artists[0]?.name ?? '',
      title: track.title,
      source,
    };
  }

  private keyFor(track: Track): MappingRequest {
    return { ...this.identify(track), author_id: this.authorId() };
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
}

export const streamVerificationApi = new StreamVerificationApi(
  'https://nuclear-tritone.fly.dev',
  Duration.fromObject({ minutes: 5 }).toMillis(),
);
