import { has } from 'lodash';
import { NuclearService } from './NuclearService';

type StreamMapping = {
    id: string;
    artist: string;
    title: string;
    source: string;
    stream_id: string;
    author_id: string;
}

export type TopStream = {
  stream_id: string;
  score: number;
  self_verified: boolean;
}

type PostStreamMappingPayload = Omit<StreamMapping, 'id'>;

type DeleteStreamMappingPayload = Omit<StreamMapping, 'id'>;

type ErrorBody = {
  message: string[];
  error: string;
}


type SuccessCacheEntry = {
  type: 'success';
  value: TopStream;
  timestamp: number;
}

type ErrorCacheEntry = {
  type: 'error';
  error: ErrorBody;
  timestamp: number;
}

type StreamCacheEntry = SuccessCacheEntry | ErrorCacheEntry;

export const isSuccessCacheEntry = (data: StreamCacheEntry): data is SuccessCacheEntry => {
  return data.type === 'success';
};

export const isErrorCacheEntry = (data: StreamCacheEntry): data is ErrorCacheEntry => {
  return data.type === 'error';
};

export class NuclearStreamMappingsService extends NuclearService {
  private static instance: NuclearStreamMappingsService;
  private topStreamCache = new Map<string, StreamCacheEntry>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor(baseUrl: string) {
    super(baseUrl);
  }

  static get(baseUrl: string): NuclearStreamMappingsService {
    if (!NuclearStreamMappingsService.instance) {
      NuclearStreamMappingsService.instance = new NuclearStreamMappingsService(baseUrl);
    }

    return NuclearStreamMappingsService.instance;
  }

  private createCacheKey(artist: string, title: string, source: string): string {
    return `${artist}:${title}:${source}`;
  }

  private isValidCacheEntry(entry: StreamCacheEntry): boolean {
    return Date.now() - entry.timestamp < this.CACHE_TTL;
  }

  clearTopStreamCache(): void {
    this.topStreamCache.clear();
  }

  invalidateTopStreamCache(artist: string, title: string, source: string, author_id: string): void {
    const cacheKey = this.createCacheKey(artist, title, source);
    this.topStreamCache.delete(cacheKey);
  }

  async getTopStream(artist: string, title: string, source: string, author_id: string) {
    const cacheKey = this.createCacheKey(artist, title, source);
    const cachedEntry = this.topStreamCache.get(cacheKey);

    if (cachedEntry && this.isValidCacheEntry(cachedEntry)) {
      return cachedEntry;
    }

    if (cachedEntry) {
      this.topStreamCache.delete(cacheKey);
    }

    const result = await this.getJson<TopStream, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/top-stream`, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify({ artist, title, source, author_id })
    }));

    if (result.ok) {
      const cacheEntry: SuccessCacheEntry = {  type: 'success', value: result.body as TopStream, timestamp: Date.now() };
      this.topStreamCache.set(this.createCacheKey(artist, title, source), cacheEntry);
      return cacheEntry;
    } else {
      const cacheEntry: ErrorCacheEntry = { type: 'error', error: result.body as ErrorBody, timestamp: Date.now() };
      this.topStreamCache.set(this.createCacheKey(artist, title, source), cacheEntry);
      return cacheEntry;
    }
  }

  async postStreamMapping(mapping: PostStreamMappingPayload) {
    const result = await this.getJson<void, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/verify`, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify(mapping)
    }));
    
    this.invalidateTopStreamCache(mapping.artist, mapping.title, mapping.source, mapping.author_id);
    return result;
  }

  async deleteStreamMapping(mapping: DeleteStreamMappingPayload) {
    const result = await this.getJson<void, ErrorBody>(fetch(`${this.baseUrl}/stream-mappings/unverify`, {
      headers: this.getHeaders(),
      method: 'DELETE',
      body: JSON.stringify(mapping)
    }));
    
    this.invalidateTopStreamCache(mapping.artist, mapping.title, mapping.source, mapping.author_id);
    return result;
  }
}
