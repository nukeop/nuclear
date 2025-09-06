import { logger } from '../../';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface CacheOptions {
  ttl?: number;
  keyGenerator?: (methodName: string, args: unknown[]) => string;
  shouldCache?: (methodName: string, args: unknown[], result: unknown) => boolean;
}

export class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number;

  constructor(defaultTTL = 60 * 60 * 1000) { // 1 hour default
    this.defaultTTL = defaultTTL;
  }

  private generateKey(methodName: string, args: unknown[]): string {
    try {
      return `${methodName}:${JSON.stringify(args)}`;
    } catch (error) {
      // Fallback for non-serializable arguments
      return `${methodName}:${args.map(arg => String(arg)).join(',')}`;
    }
  }

  private isExpired(entry: CacheEntry<unknown>, ttl: number): boolean {
    return Date.now() - entry.timestamp > ttl;
  }

  get<T>(key: string, ttl = this.defaultTTL): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (this.isExpired(entry, ttl)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(ttl = this.defaultTTL): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      logger.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
    }
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): { size: number; oldestEntry: number | null; newestEntry: number | null } {
    let oldest: number | null = null;
    let newest: number | null = null;

    this.cache.forEach(entry => {
      if (oldest === null || entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
      if (newest === null || entry.timestamp > newest) {
        newest = entry.timestamp;
      }
    });

    return {
      size: this.cache.size,
      oldestEntry: oldest,
      newestEntry: newest
    };
  }
}
