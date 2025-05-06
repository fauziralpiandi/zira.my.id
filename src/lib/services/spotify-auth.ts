import { SPOTIFY_ENV } from './spotify-env';

const SPOTIFY = SPOTIFY_ENV;

const LOG_PREFIX = '[Spotify Auth]';

type Response = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const getBasicToken = (() => {
  let cachedToken: string | null = null;
  return () => {
    try {
      if (!SPOTIFY.CLIENT_ID || !SPOTIFY.CLIENT_SECRET) {
        console.error(
          `${LOG_PREFIX} Error: Missing CLIENT_ID or CLIENT_SECRET`,
        );
        throw new Error(
          'Invalid Spotify configuration: missing client credentials',
        );
      }

      return (cachedToken ??= Buffer.from(
        `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`,
      ).toString('base64'));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        `${LOG_PREFIX} Error: Failed to generate basic token - ${errorMessage}`,
      );
      throw new Error(
        'Failed to authenticate with Spotify: invalid client configuration',
      );
    }
  };
})();

function isAccessTokenResponse(data: unknown): data is Response {
  try {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const requiredFields = ['access_token', 'token_type', 'expires_in'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        return false;
      }
    }

    const typedData = data as Record<string, unknown>;
    if (
      typeof typedData.access_token !== 'string' ||
      typeof typedData.token_type !== 'string' ||
      typeof typedData.expires_in !== 'number'
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to validate token response`,
      error,
    );
    return false;
  }
}

export async function getAccessToken(): Promise<string> {
  try {
    if (!SPOTIFY.REFRESH_TOKEN || !SPOTIFY.TOKEN_URL) {
      console.error(`${LOG_PREFIX} Error: Missing REFRESH_TOKEN or TOKEN_URL`);
      throw new Error(
        'Invalid Spotify configuration: missing required credentials',
      );
    }

    const res = await fetch(SPOTIFY.TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${getBasicToken()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY.REFRESH_TOKEN,
      }),
    });

    if (!res.ok) {
      const statusCode = res.status;
      let errorMessage = `Spotify authentication failed (HTTP ${statusCode})`;

      if (statusCode === 401) {
        errorMessage = 'Spotify authentication failed: invalid credentials';
      } else if (statusCode === 429) {
        errorMessage = 'Spotify authentication failed: rate limit exceeded';
      } else if (statusCode >= 500) {
        errorMessage = 'Spotify authentication failed: service unavailable';
      }

      console.error(
        `${LOG_PREFIX} Error: Failed to fetch token (HTTP ${statusCode})`,
      );
      throw new Error(errorMessage);
    }

    const data = await res.json();
    if (!isAccessTokenResponse(data)) {
      console.error(`${LOG_PREFIX} Error: Invalid token response format`);
      throw new Error(
        'Invalid Spotify response format: missing required fields',
      );
    }

    return data.access_token;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: ${errorMessage}`);

    if (!(error instanceof Error)) {
      throw new Error(`Spotify authentication error: ${errorMessage}`);
    }

    throw error;
  }
}
