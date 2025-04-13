type FetchOptions = RequestInit & { headers?: Record<string, string> };

/**
 * Sprints to fetch a resource with a time-bound vow.
 * Halts if the clock outpaces the promise, yielding a quiet lament.
 * @param url - The destination to pursue.
 * @param options - Fetch settings to guide the journey.
 * @param timeout - Milliseconds to wait before surrender.
 * @returns A Response, or an error if time runs dry.
 */
const fetchWithTimeout = async (
  url: string,
  options: FetchOptions,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort();
      reject(new Error(`Request to ${url} timed out after ${timeout}ms`));
    }, timeout)
  );

  return Promise.race([
    fetch(url, { ...options, signal: controller.signal }),
    timeoutPromise,
  ]);
};

/**
 * Ventures to Spotify’s realm for treasured data.
 * Bears an access token as its key, returning riches or a whispered error.
 * @param url - The Spotify endpoint to explore.
 * @param accessToken - The token to unlock the gate.
 * @param timeout - Milliseconds to linger before retreat (defaults to 5000).
 * @returns A promise of data shaped as T, or an error’s gentle sting.
 */
export const fetchSpotifyData = async <T>(
  url: string,
  accessToken: string,
  timeout = 5000
): Promise<T> => {
  try {
    if (!accessToken) {
      throw new Error('Missing access token');
    }

    const response = await fetchWithTimeout(
      url,
      { headers: { Authorization: `Bearer ${accessToken}` } },
      timeout
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized access token');
      }
      throw new Error(`Failed to fetch from ${url}: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', error);
      if (error instanceof Error) console.error(error.stack);
    } else {
      console.error(`[ERROR] ${new Date().toISOString()}: ${String(error)}`);
    }
    throw error instanceof Error ? error : new Error('Unexpected fetch error');
  }
};
