const SPOTIFY = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
  REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN!,
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
} as const;
const BASIC = Buffer.from(
  `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`,
).toString('base64');

let token: string | null = null;
let expiry = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (now < expiry) {
    return String(token);
  }

  const res = await fetch(SPOTIFY.TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASIC}`,
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

  const { access_token, expires_in } = await res.json();

  token = access_token;
  expiry = now + (expires_in - 60) * 1e3;

  return String(token);
}

async function fetchSpotify<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  return data as T;
}

export { getAccessToken, fetchSpotify };
