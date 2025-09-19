function accessLocalStorage<T>(
  action: 'get' | 'set' | 'remove',
  key: string,
  value?: T,
): T | null {
  if (typeof window === 'undefined') return null;

  try {
    switch (action) {
      case 'get':
        return JSON.parse(localStorage.getItem(key) || 'null') as T;

      case 'set':
        if (value !== undefined) {
          localStorage.setItem(key, JSON.stringify(value));

          return value;
        }

        return null;

      case 'remove':
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}:ts`);

        return null;
    }
  } catch {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}:ts`);

    return null;
  }
}

export async function saveCache<T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const cached = accessLocalStorage<T>('get', key);
  const timestamp = accessLocalStorage<number>('get', `${key}:ts`);

  if (cached && typeof timestamp === 'number' && now - timestamp < maxAge) {
    return cached;
  }

  const data = await fetchData();

  accessLocalStorage('set', key, data);
  accessLocalStorage('set', `${key}:ts`, now);

  return data;
}
