import { CacheManager, CacheOptions } from './CacheManager';
import { logger } from '../../';

export function cacheable(options: CacheOptions = {}) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      throw new Error(`Method ${propertyKey} not found`);
    }
    
    const ttl = options.ttl ?? 60 * 60 * 1000;

    descriptor.value = async function (this: { _cacheManager?: CacheManager }, ...args: unknown[]) {
      const cacheManager: CacheManager = this._cacheManager || new CacheManager();
      
      const key = options.keyGenerator 
        ? options.keyGenerator(propertyKey, args)
        : `${propertyKey}:${JSON.stringify(args)}`;

      const cachedResult = cacheManager.get(key, ttl);
      if (cachedResult !== null) {
        logger.debug(`Cache hit for ${propertyKey}:`, key);
        return cachedResult;
      }

      try {
        const result = await originalMethod.apply(this, args);
        
        const shouldCache = options.shouldCache 
          ? options.shouldCache(propertyKey, args, result)
          : true;

        if (shouldCache) {
          cacheManager.set(key, result);
          logger.debug(`Cache miss, stored result for ${propertyKey}:`, key);
        }

        return result;
      } catch (error) {
        logger.error(`Error in cached method ${propertyKey}:`, error);
        throw error;
      }
    } as T;

    return descriptor;
  };
}

export function withCache<T extends new (...args: any[]) => object>(
  constructor: T,
  options: CacheOptions = {}
): T {
  return class extends constructor {
    public _cacheManager: CacheManager;

    constructor(...args: any[]) {
      super(...args);
      this._cacheManager = new CacheManager(options.ttl);
      
      // Set up periodic cleanup
      setInterval(() => {
        this._cacheManager.cleanup();
      }, 5 * 60 * 1000); // Cleanup every 5 minutes
    }

    getCacheStats() {
      return this._cacheManager.getStats();
    }

    clearCache() {
      this._cacheManager.clear();
    }

    deleteCacheEntry(key: string) {
      return this._cacheManager.delete(key);
    }
  } as T;
}
