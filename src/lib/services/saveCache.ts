type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

/**
 * Caches data in localStorage with expiration.
 *
 * Returns cached data if fresh, otherwise fetches and updates the cache.
 *
 * @param key - Unique cache key
 * @param maxAge - Cache lifetime in ms
 * @param fetchData - Async function to fetch new data
 * @returns Cached or fresh data
 */
export const saveCache = async <T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>
): Promise<T> => {
  const timestampKey = `${key}:ts`;

  /**
   * Parses cache entry if both value and timestamp exist and are valid.
   */
  const getCache = (): CacheEntry<T> | null => {
    try {
      const raw = localStorage.getItem(key);
      const rawTs = localStorage.getItem(timestampKey);

      if (!raw || !rawTs) return null;

      const timestamp = Number(rawTs);
      if (!Number.isFinite(timestamp)) return null;

      const data = JSON.parse(raw) as T;
      return { data, timestamp };
    } catch {
      console.warn(`[cache] Failed to read key: ${key}`);
      return null;
    }
  };

  /**
   * Stores the value and timestamp, with fallback cleanup on failure.
   */
  const setCache = (data: T, timestamp: number): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(timestampKey, timestamp.toString());
    } catch (err) {
      console.error(`[cache] Failed to save key: ${key}`, err);
      localStorage.removeItem(key);
      localStorage.removeItem(timestampKey);
    }
  };

  const now = Date.now();
  const cache = getCache();

  if (cache && now - cache.timestamp < maxAge) return cache.data;

  const freshData = await fetchData();
  setCache(freshData, now);
  return freshData;
};
