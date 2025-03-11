import { SPOTIFY_ENV } from './spotifyEnv';

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const SPOTIFY = SPOTIFY_ENV;

const getBasicToken = (() => {
  let cachedToken: string | null = null;
  return () =>
    (cachedToken ??= Buffer.from(
      `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`
    ).toString('base64'));
})();

const isAccessTokenResponse = (data: unknown): data is AccessTokenResponse =>
  !!data &&
  typeof data === 'object' &&
  'access_token' in data &&
  'token_type' in data &&
  'expires_in' in data &&
  typeof (data as Record<string, unknown>).access_token === 'string' &&
  typeof (data as Record<string, unknown>).token_type === 'string' &&
  typeof (data as Record<string, unknown>).expires_in === 'number';

const formatError = (message: string, error: unknown): Error => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return new Error(`${message}: ${errorMessage}`);
};

export const getAccessToken = async (): Promise<string> => {
  try {
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
      throw new Error(
        `Failed to fetch access token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!isAccessTokenResponse(data)) {
      throw new Error('Invalid response structure for access token.');
    }

    return data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw formatError('Error fetching access token', error);
  }
};
