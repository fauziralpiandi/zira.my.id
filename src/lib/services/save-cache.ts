type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const LOG_PREFIX = '[CacheManager]';

export async function saveCache<T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>,
): Promise<T> {
  function getCache(): CacheEntry<T> | null {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem(key);
      const rawTs = localStorage.getItem(`${key}:ts`);
      if (!raw || !rawTs) return null;
      const timestamp = Number(rawTs);
      if (!Number.isFinite(timestamp)) return null;
      const data = JSON.parse(raw) as T;
      return { data, timestamp };
    } catch {
      return null;
    }
  }

  function setCache(data: T, timestamp: number): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}:ts`, timestamp.toString());
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error: Failed to set cache - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      try {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}:ts`);
      } catch {}
    }
  }

  const now = Date.now();
  const cachedEntry = getCache();
  if (cachedEntry && now - cachedEntry.timestamp < maxAge) {
    return cachedEntry.data;
  }

  try {
    const data = await fetchData();
    setCache(data, now);
    return data;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to fetch data for key "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    throw new Error('Cache fetch failed');
  }
}
