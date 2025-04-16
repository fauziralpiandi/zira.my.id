type FetchOptions = RequestInit & { headers?: Record<string, string> };

const LOG_PREFIX = '[Spotify Fetch]';

const fetchWithTimeout = async (
  url: string,
  options: FetchOptions,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort();
      console.error(`${LOG_PREFIX} Fetch timeout (${url})`);
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
    console.error(`${LOG_PREFIX} No access token provided`);
    throw new Error('Invalid access token');
  }

  try {
    const res = await fetchWithTimeout(
      url,
      { headers: { Authorization: `Bearer ${accessToken}` } },
      timeout
    );

    if (!res.ok) {
      console.error(
        `${LOG_PREFIX} Failed to fetch (${url}): HTTP ${res.status}`
      );
      throw new Error('Spotify API failed');
    }

    return (await res.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error fetching ${url}: ${message}`);
    throw error;
  }
};
