import { RetrievalResult } from './engine';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class AICacheManager {
  private retrievalCache = new Map<string, CacheEntry<RetrievalResult>>();
  private ttlMs = 10 * 60 * 1000; // 10 minutes TTL

  public getCachedRetrieval(query: string, categoryFilter?: string): RetrievalResult | null {
    const key = `${query.toLowerCase().trim()}_${categoryFilter || 'all'}`;
    const entry = this.retrievalCache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.retrievalCache.delete(key);
      return null;
    }

    console.log(`[AI CACHE] Cache Hit for query: "${query}"`);
    return entry.data;
  }

  public setCachedRetrieval(query: string, categoryFilter: string | undefined, data: RetrievalResult): void {
    const key = `${query.toLowerCase().trim()}_${categoryFilter || 'all'}`;
    this.retrievalCache.set(key, { data, timestamp: Date.now() });
  }

  public clear(): void {
    this.retrievalCache.clear();
  }
}

export const aiCache = new AICacheManager();
