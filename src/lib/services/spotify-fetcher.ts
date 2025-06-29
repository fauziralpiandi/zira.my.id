type FetchOptions = RequestInit & { headers?: Record<string, string> };

const LOG_PREFIX = '[Spotify Fetcher]';

async function fetchWithTimeout(
  url: string,
  options: FetchOptions,
  timeout: number,
): Promise<Response> {
  try {
    const controller = new AbortController();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => {
        controller.abort();
        console.error(`${LOG_PREFIX} Error: Request timeout for URL ${url} after ${timeout}ms`);
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout),
    );

    return Promise.race([fetch(url, { ...options, signal: controller.signal }), timeoutPromise]);
  } catch (error) {
    console.error(`${LOG_PREFIX} Error: Failed to initialize fetch request to ${url}`, error);
    throw new Error(`Failed to initialize request to ${url}`);
  }
}

export async function fetchSpotify<T>(
  url: string,
  accessToken: string,
  timeout = 3000,
): Promise<T> {
  try {
    if (!url) {
      console.error(`${LOG_PREFIX} Error: No URL provided`);
      throw new Error('Invalid request: URL is required');
    }

    if (!accessToken) {
      console.error(`${LOG_PREFIX} Error: No access token provided`);
      throw new Error('Invalid authentication: access token is required');
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
      let errorMessage = `Spotify API request failed with status ${status}`;

      if (status === 401) {
        errorMessage = 'Spotify API authorization failed: token may be invalid or expired';
      } else if (status === 403) {
        errorMessage = 'Spotify API access forbidden: insufficient permissions';
      } else if (status === 404) {
        errorMessage = `Spotify API resource not found: ${url}`;
      } else if (status === 429) {
        errorMessage = 'Spotify API rate limit exceeded';
      } else if (status >= 500) {
        errorMessage = 'Spotify API server error';
      }

      console.error(`${LOG_PREFIX} Error: ${errorMessage} for URL ${url}`);
      throw new Error(errorMessage);
    }

    try {
      const data = await res.json();
      return data as T;
    } catch (parseError) {
      console.error(`${LOG_PREFIX} Error: Failed to parse JSON response from ${url}`, parseError);
      throw new Error('Invalid response format: unable to parse JSON');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: ${message} when fetching ${url}`);

    if (!(error instanceof Error)) {
      throw new Error(`Spotify API request failed: ${message}`);
    }

    throw error;
  }
}
