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
  let token: string | null = null; // cached token

  return () => {
    if (token) {
      return token;
    }

    return (token = Buffer.from(
      `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`,
    ).toString('base64'));
  };
})();

let accessToken: string | null = null; // cached token
let tokenExpiry = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (accessToken && now < tokenExpiry) {
    return accessToken;
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
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  if (typeof data.access_token !== 'string' || !data.access_token) {
    throw new Error('Invalid access token');
  }

  const expiresIn =
    typeof data.expires_in === 'number' ? data.expires_in : 3600;

  accessToken = data.access_token;
  tokenExpiry = now + expiresIn * 1e3 - 60 * 1e3; // 1 min buffer

  return accessToken as string;
}
