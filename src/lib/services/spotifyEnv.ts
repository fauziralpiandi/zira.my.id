type Spotify = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REFRESH_TOKEN: string;
  TOKEN_URL: string;
};

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(
      `Environment variable ${key} is not defined. Using default empty string.`
    );
  }
  return value || '';
};

export const SPOTIFY_ENV: Spotify = Object.freeze({
  CLIENT_ID: getEnvVar('SPOTIFY_CLIENT_ID'),
  CLIENT_SECRET: getEnvVar('SPOTIFY_CLIENT_SECRET'),
  REFRESH_TOKEN: getEnvVar('SPOTIFY_REFRESH_TOKEN'),
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
});
