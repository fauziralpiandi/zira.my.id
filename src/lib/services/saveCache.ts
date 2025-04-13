// A frame for cached riches, bound by time’s subtle mark.
type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

/**
 * Guards a cache in the browser’s silent keep, guided by time’s measure.
 * Returns stored data if fresh, else seeks anew and seals it fast.
 * @param key - The emblem to name the cache.
 * @param maxAge - The span in milliseconds for data to endure.
 * @param fetchData - A call to summon fresh data when needed.
 * @returns Data, cached or newly drawn, steady and true.
 */
export const saveCache = async <T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>
): Promise<T> => {
  // Reads the cache’s quiet store, or yields none if broken.
  const getCache = (): CacheEntry<T> | null => {
    try {
      const raw = localStorage.getItem(key);
      const rawTs = localStorage.getItem(`${key}:ts`);

      if (!raw || !rawTs) return null;

      const timestamp = Number(rawTs);
      if (!Number.isFinite(timestamp)) return null;

      const data = JSON.parse(raw) as T;
      return { data, timestamp };
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[CACHE] Failed to read ${key}`, error);
      } else {
        console.error(
          `[CACHE] [ERROR] ${new Date().toISOString()}: Failed to read ${key}`
        );
      }
      return null;
    }
  };

  // Sets the cache with data and time, or clears it if marred.
  const setCache = (data: T, timestamp: number): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}:ts`, timestamp.toString());
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[CACHE] Failed to save ${key}`, error);
      } else {
        console.error(
          `[CACHE] [ERROR] ${new Date().toISOString()}: Failed to save ${key}`
        );
      }
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}:ts`);
    }
  };

  try {
    const now = Date.now();
    const cache = getCache();

    if (cache && now - cache.timestamp < maxAge) {
      return cache.data;
    }

    const freshData = await fetchData();
    setCache(freshData, now);
    return freshData;
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[CACHE] Failed to fetch ${key}`, error);
    } else {
      console.error(
        `[CACHE] [ERROR] ${new Date().toISOString()}: Failed to fetch ${key}`
      );
    }
    throw error instanceof Error ? error : new Error('Cache fetch failed');
  }
};
