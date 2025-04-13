import { SPOTIFY_ENV } from './spotifyEnv';

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const SPOTIFY = SPOTIFY_ENV;

/**
 * Crafts a basic token with quiet efficiency.
 * Caches the result to avoid redundant computation, locked in memory’s vault.
 * @returns A base64-encoded string of client ID and secret.
 */
const getBasicToken = (() => {
  let cachedToken: string | null = null;
  return () =>
    (cachedToken ??= Buffer.from(
      `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`
    ).toString('base64'));
})();

/**
 * Guards the gate of Spotify’s token response.
 * Ensures the data sings the expected tune before passing through.
 * @param data - The raw response to inspect.
 * @returns True if the data matches the expected structure, false otherwise.
 */
const isAccessTokenResponse = (data: unknown): data is AccessTokenResponse =>
  !!data &&
  typeof data === 'object' &&
  'access_token' in data &&
  'token_type' in data &&
  'expires_in' in data &&
  typeof (data as Record<string, unknown>).access_token === 'string' &&
  typeof (data as Record<string, unknown>).token_type === 'string' &&
  typeof (data as Record<string, unknown>).expires_in === 'number';

/**
 * Pursues Spotify’s access token with steadfast resolve.
 * Trades a refresh token for a new key to the musical vault.
 * @returns A promise of a fresh access token, or an error’s quiet murmur.
 */
export const getAccessToken = async (): Promise<string> => {
  try {
    if (
      !SPOTIFY.CLIENT_ID ||
      !SPOTIFY.CLIENT_SECRET ||
      !SPOTIFY.REFRESH_TOKEN
    ) {
      throw new Error('Missing Spotify credentials');
    }

    const response = await fetch(SPOTIFY.TOKEN_URL, {
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

    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${response.status}`);
    }

    const data = await response.json();

    if (!isAccessTokenResponse(data)) {
      throw new Error('Invalid access token response structure');
    }

    return data.access_token;
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', error);
      if (error instanceof Error) console.error(error.stack);
    } else {
      console.error(`[ERROR] ${new Date().toISOString()}: ${String(error)}`);
    }
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch access token');
  }
};
