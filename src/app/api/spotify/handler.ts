const SPOTIFY = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
  REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN!,
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
} as const;

const getBasic = (() => {
  let val: string | null = null;

  return () =>
    (val ??= Buffer.from(
      `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`,
    ).toString('base64'));
})();

let token: string | null = null;
let expiry = 0;

export async function getAccessToken(): Promise<string> {
  if (token && Date.now() < expiry) {
    return token;
  }

  const res = await fetch(SPOTIFY.TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getBasic()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
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

  if (!data.access_token) {
    throw new Error('Invalid access token');
  }

  token = data.access_token;
  expiry = Date.now() + 45e3; // 45 seconds

  return String(token);
}

export async function fetchSpotify<T>(
  url: string,
  accessToken: string,
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  return data as T;
}
