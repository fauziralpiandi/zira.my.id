export async function saveCache<T>(
  namespace: string,
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>,
): Promise<T> {
  if (typeof window === 'undefined') {
    return fetchData();
  }

  const now = Date.now();
  const base = `${namespace}:${key}`;
  const cached = JSON.parse(localStorage.getItem(base) || 'null') as T | null;
  const timestamp = Number(localStorage.getItem(`${base}:ts`) || 0);

  if (cached && now - timestamp < maxAge) {
    return cached;
  }

  const data = await fetchData();

  localStorage.setItem(base, JSON.stringify(data));
  localStorage.setItem(`${base}:ts`, String(now));

  return data;
}
