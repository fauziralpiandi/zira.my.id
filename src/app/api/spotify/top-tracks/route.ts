import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotifyData } from '~/lib/services';

// Tipe dulu biar alur jelas
type TopTrack = {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
};

type ResponseData = {
  items: Array<TopTrack>;
};

type TrackResponse = {
  title: string;
  artist: string;
  cover: string;
  url: string;
};

/**
 * Error messages and status codes, mapped for clarity.
 * Fuels AppError with concise, consistent responses.
 */
const LOGGING = {
  'No access token': {
    message: 'Missing Spotify access token',
    status: 401,
  },
  'No track data': {
    message: 'No top tracks found',
    status: 404,
  },
  'Invalid track data': {
    message: 'Invalid track data',
    status: 500,
  },
  'Failed to fetch data': {
    message: 'Failed to fetch Spotify data',
    status: 500,
  },
} as const;

type KnownErrorKey = keyof typeof LOGGING;

/**
 * A custom error, sculpted to hum with LOGGING’s cadence.
 * Ensures every stumble yields a clear note and status.
 * @example
 * throw new AppError('No track data'); // Glides to a 404 with grace
 */
class AppError extends Error {
  public status: number;
  public key: KnownErrorKey;

  constructor(key: KnownErrorKey) {
    super(key);
    this.key = key;
    this.status = LOGGING[key].status;
  }
}

/**
 * Spins a JSON response with elegance and intent.
 * Every reply weaves a consistent thread for the client’s delight.
 * @param data - The payload to unveil, be it song or apology.
 * @param status - HTTP status, defaulting to a radiant 200.
 * @returns A NextResponse, cloaked in JSON’s charm.
 */
const jsonResponse = (data: object, status: number = 200): NextResponse =>
  NextResponse.json(data, { status });

/**
 * Chisels a collection of tracks from Spotify’s raw marble.
 * Ensures each title, artist, cover, and link shines, or fades if flawed.
 * @param data - Spotify’s raw response, pulsing with potential.
 * @returns A polished array of track portraits or an error’s sigh.
 */
const formatResponse = (data: ResponseData): TrackResponse[] => {
  if (!data.items || data.items.length === 0) {
    throw new AppError('No track data');
  }

  return data.items.map((track) => {
    if (
      !track.name ||
      !track.artists[0]?.name ||
      !track.album.images[0]?.url ||
      !track.external_urls.spotify
    ) {
      throw new AppError('Invalid track data');
    }
    return {
      title: track.name,
      artist: track.artists.map((artist) => artist.name).join(', '),
      cover: track.album.images[0].url,
      url: track.external_urls.spotify,
    };
  });
};

/**
 * Pursues Spotify’s top tracks with steady resolve.
 * Draws from the short-term rhythm of user taste.
 * @param accessToken - The key to Spotify’s musical vault.
 * @returns A promise of raw Spotify data, or an error’s quiet murmur.
 */
const getTopTracksData = async (accessToken: string): Promise<ResponseData> => {
  const TOP_TRACKS_URL =
    'https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=short_term';

  try {
    return await fetchSpotifyData<ResponseData>(TOP_TRACKS_URL, accessToken);
  } catch {
    throw new AppError('Failed to fetch data');
  }
};

/**
 * Orchestrates a GET request to summon Spotify’s top tracks.
 * Delivers a vibrant array of melodies or a gentle error’s bow.
 * @returns A JSON response, alive with music or softened by grace.
 */
export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new AppError('No access token');
    }

    const topTracksData = await getTopTracksData(accessToken);
    return jsonResponse(formatResponse(topTracksData));
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', error);
      if (error instanceof Error) console.error(error.stack);
    } else {
      console.error(`[ERROR] ${new Date().toISOString()}: ${String(error)}`);
    }

    if (error instanceof AppError) {
      return jsonResponse({ error: LOGGING[error.key].message }, error.status);
    }
    return jsonResponse({ error: 'Unexpected error occurred' }, 500);
  }
};
