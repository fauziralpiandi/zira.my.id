function getEnvVar(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
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

    return (cachedToken = Buffer.from(
      `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`,
    ).toString('base64'));
  };
})();

export async function getAccessToken(): Promise<string> {
  try {
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
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (typeof data.access_token !== 'string' || !data.access_token) {
      throw new Error('Invalid token response');
    }

    return data.access_token;
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    throw new Error(e);
  }
}
