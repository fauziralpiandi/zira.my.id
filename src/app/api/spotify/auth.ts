function getEnvVar(key: string): string {
  return process.env[key] ?? '';
}

const SPOTIFY = Object.freeze({
  CLIENT_ID: getEnvVar('SPOTIFY_CLIENT_ID'),
  CLIENT_SECRET: getEnvVar('SPOTIFY_CLIENT_SECRET'),
  REFRESH_TOKEN: getEnvVar('SPOTIFY_REFRESH_TOKEN'),
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
});

const getBasicToken = (() => {
  let cachedToken: string | null = null;

  return () => {
    if (cachedToken) {
      return cachedToken;
    }
    if (!SPOTIFY.CLIENT_ID || !SPOTIFY.CLIENT_SECRET) {
      throw new Error('Missing client credentials');
    }

    return (cachedToken = Buffer.from(
      `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`,
    ).toString('base64'));
  };
})();

export async function getAccessToken(): Promise<string> {
  try {
    if (!SPOTIFY.REFRESH_TOKEN || !SPOTIFY.TOKEN_URL) {
      throw new Error('Missing refresh token or token URL');
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
      const status = res.status;

      throw new Error(
        status === 401
          ? 'Invalid credentials'
          : status === 429
            ? 'Rate limit exceeded'
            : status >= 500
              ? 'Service unavailable'
              : `HTTP ${status}`,
      );
    }

    const data = await res.json();

    if (!data.access_token || typeof data.access_token !== 'string') {
      throw new Error('Invalid token response');
    }

    return data.access_token;
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    throw new Error(`Authentication failed: ${e}`);
  }
}
