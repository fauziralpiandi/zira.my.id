type FetchOptions = RequestInit & { headers?: Record<string, string> };

async function fetchWithTimeout(
  url: string,
  opts: FetchOptions,
  timeout = 3e3,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchSpotify<T>(
  url: string,
  accessToken: string,
  timeout = 3e3,
): Promise<T> {
  try {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const res = await fetchWithTimeout(
      url,
      {
        headers: {
          ...(typeof ({} as FetchOptions).headers === 'object' ? {} : {}),
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
      timeout,
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    let data: unknown;

    try {
      data = await res.json();
    } catch {
      throw new Error('Invalid JSON response');
    }

    return data as T;
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';
    
    throw new Error(e);
  }
}
