export const saveCache = async <T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>
): Promise<T> => {
  try {
    const cachedData = localStorage.getItem(key);
    const cacheTimestamp = localStorage.getItem(`${key}Timestamp`);
    const currentTime = Date.now();

    if (cachedData && cacheTimestamp) {
      const parsedTimestamp = parseInt(cacheTimestamp);

      if (currentTime - parsedTimestamp < maxAge) {
        try {
          return JSON.parse(cachedData) as T;
        } catch {
          console.warn(`Failed to parse cached data for key: ${key}`);
        }
      }
    }

    const data = await fetchData();
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}Timestamp`, currentTime.toString());

    return data;
  } catch (error) {
    console.error(`Error fetching data for key: ${key}`, error);
    throw error;
  }
};
