type FetchOptions = RequestInit & { headers?: Record<string, string> };

async function fetchWithTimeout(
  url: string,
  opts: FetchOptions,
  timeout = 3e3,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort();

      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout),
  );

  return Promise.race([
    fetch(url, { ...opts, signal: controller.signal }),
    timeoutPromise,
  ]);
}

export async function fetchSpotify<T>(
  url: string,
  accessToken: string,
  timeout = 3e3,
): Promise<T> {
  try {
    if (!url || !accessToken) {
      throw new Error(!url ? 'URL is required' : 'Access token is required');
    }

    const res = await fetchWithTimeout(
      url,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
      timeout,
    );

    if (!res.ok) {
      const status = res.status;

      throw new Error(
        status === 401
          ? 'Invalid or expired token'
          : status === 403
            ? 'Insufficient permissions'
            : status === 404
              ? `Resource not found: ${url}`
              : status === 429
                ? 'Rate limit exceeded'
                : status >= 500
                  ? 'Server error'
                  : `HTTP ${status}`,
      );
    }

    const data = await res.json();

    return data as T;
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    throw new Error(`Fetch failed: ${e}`);
  }
}
