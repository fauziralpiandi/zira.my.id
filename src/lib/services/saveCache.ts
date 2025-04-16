type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

export const saveCache = async <T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>
): Promise<T> => {
  const getCache = (): CacheEntry<T> | null => {
    try {
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
  };

  const setCache = (data: T, timestamp: number): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}:ts`, timestamp.toString());
    } catch {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}:ts`);
    }
  };

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
    console.error(`[Cache fetch failed: (${key})]:`, error);
    throw new Error('Cache fetch failed');
  }
};
