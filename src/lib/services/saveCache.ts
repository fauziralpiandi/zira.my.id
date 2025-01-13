export const saveCache = <T>(
  key: string,
  maxAge: number,
  fetchData: () => Promise<T>
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const cachedData = localStorage.getItem(key);
    const cacheTimestamp = localStorage.getItem(`${key}Timestamp`);
    const currentTime = Date.now();

    if (
      cachedData &&
      cacheTimestamp &&
      currentTime - parseInt(cacheTimestamp) < maxAge
    ) {
      resolve(JSON.parse(cachedData) as T);
      return;
    }

    try {
      const data = await fetchData();
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}Timestamp`, currentTime.toString());
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
