const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
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

export const fetchSpotifyData = async <T>(
  url: string,
  accessToken: string,
  timeout = 5000
): Promise<T> => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const response = await fetchWithTimeout(
      url,
      { headers: { Authorization: `Bearer ${accessToken}` } },
      timeout
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => response.text());
      if (response.status === 401) {
        throw new Error('Unauthorized access, check your access token');
      }
      throw new Error(
        `Failed to fetch data from ${url}: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unexpected error occurred');
  }
};
