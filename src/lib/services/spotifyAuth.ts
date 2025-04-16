import { SPOTIFY_ENV } from './spotifyEnv';

const SPOTIFY = SPOTIFY_ENV;

type Response = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const getBasicToken = (() => {
  let cachedToken: string | null = null;
  return () =>
    (cachedToken ??= Buffer.from(
      `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`
    ).toString('base64'));
})();

const isAccessTokenResponse = (data: unknown): data is Response =>
  !!data &&
  typeof data === 'object' &&
  'access_token' in data &&
  'token_type' in data &&
  'expires_in' in data &&
  typeof (data as Record<string, unknown>).access_token === 'string' &&
  typeof (data as Record<string, unknown>).token_type === 'string' &&
  typeof (data as Record<string, unknown>).expires_in === 'number';

export const getAccessToken = async (): Promise<string> => {
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
    console.error(`[Spotify API request failed]: ${res.status}`);
    throw new Error('Spotify API request failed');
  }

  const data = await res.json();
  if (!isAccessTokenResponse(data)) {
    console.error('[Invalid Spotify API response]:', data);
    throw new Error('Invalid Spotify API response');
  }

  return data.access_token;
};
