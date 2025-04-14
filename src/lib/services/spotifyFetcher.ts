type FetchOptions = RequestInit & { headers?: Record<string, string> };

const fetchWithTimeout = async (
  url: string,
  options: FetchOptions,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort();
      reject(new Error('Something broke!'));
    }, timeout)
  );
  return Promise.race([
    fetch(url, { ...options, signal: controller.signal }),
    timeoutPromise,
  ]);
};

export const fetchSpotify = async <T>(
  url: string,
  accessToken: string,
  timeout = 5000
): Promise<T> => {
  try {
    if (!accessToken) {
      throw new Error('Something broke!');
    }
    const res = await fetchWithTimeout(
      url,
      { headers: { Authorization: `Bearer ${accessToken}` } },
      timeout
    );
    if (!res.ok) {
      throw new Error('Something broke!');
    }
    return (await res.json()) as T;
  } catch {
    throw new Error('Something broke!');
  }
};
