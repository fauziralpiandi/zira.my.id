type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

function accessLocalStorage<T>(
  action: 'get' | 'set' | 'remove',
  key: string,
  value?: T,
): T | null {
  if (typeof window === 'undefined') return null;

  try {
    if (action === 'get') {
      return JSON.parse(localStorage.getItem(key) || 'null') as T;
    }

    if (action === 'set' && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));

      return value;
    }

    if (action === 'remove') {
      localStorage.removeItem(key);

      return null;
    }

    return null;
  } catch {
    if (action === 'set' || action === 'remove') {
      localStorage.removeItem(key);
    }

    return null;
  }
}

export async function saveCache<T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>,
): Promise<T> {
  const getCache = (): CacheEntry<T> | null => {
    const data = accessLocalStorage<T>('get', key);
    const timestamp = accessLocalStorage<number>('get', `${key}:ts`);

    if (!data || timestamp === null || !Number.isFinite(timestamp)) {
      return null;
    }

    return { data, timestamp };
  };

  const setCache = (data: T, timestamp: number): void => {
    accessLocalStorage('set', key, data);
    accessLocalStorage('set', `${key}:ts`, timestamp);
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

    throw new Error(e);
  }
}
