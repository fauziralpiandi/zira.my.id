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
      reject(new Error('Fetch timeout'));
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
  timeout = 3000
): Promise<T> => {
  if (!accessToken) {
    console.error('[Missing Spotify access token]');
    throw new Error('Missing access token');
  }

  const res = await fetchWithTimeout(
    url,
    { headers: { Authorization: `Bearer ${accessToken}` } },
    timeout
  );

  if (!res.ok) {
    console.error(`[Spotify API failed]: ${res.status}`);
    throw new Error('Spotify API failed');
  }

  return (await res.json()) as T;
};
