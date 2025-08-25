type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

export async function saveCache<T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>,
): Promise<T> {
  const getCache = (): CacheEntry<T> | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(key);
    const rawTs = localStorage.getItem(`${key}:ts`);

    if (!raw || !rawTs) {
      return null;
    }

    const timestamp = Number(rawTs);

    if (!Number.isFinite(timestamp)) {
      return null;
    }

    try {
      return { data: JSON.parse(raw) as T, timestamp };
    } catch {
      return null;
    }
  };

  const setCache = (data: T, timestamp: number): void => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}:ts`, timestamp.toString());
    } catch {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}:ts`);
    }
  };

  const now = Date.now();
  const cached = getCache();

  if (cached && now - cached.timestamp < maxAge) {
    return cached.data;
  }

  try {
    const data = await fetchData();

    setCache(data, now);

    return data;
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    throw new Error(`Failed to fetch data: ${e}`);
  }
}
