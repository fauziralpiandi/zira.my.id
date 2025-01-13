export const fetchSpotifyData = async <T>(
  url: string,
  accessToken: string,
  timeout = 5000
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => response.text());
      if (response.status === 401) {
        throw new Error('Unauthorized access, check your access token');
      }
      throw new Error(
        `Failed to fetch data from ${url}: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeout}ms`);
    } else {
      throw error instanceof Error
        ? error
        : new Error('An unknown error occurred');
    }
  } finally {
    clearTimeout(timer);
  }
};
