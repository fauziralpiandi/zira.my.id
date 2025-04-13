import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotifyData } from '~/lib/services';

type TopArtist = {
  name: string;
  images: Array<{ url: string }>;
  external_urls: {
    spotify: string;
  };
};

type ResponseData = {
  items: Array<TopArtist>;
};

type ArtistResponse = {
  name: string;
  image: string;
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
  'No artist data': {
    message: 'No top artists found',
    status: 404,
  },
  'Invalid artist data': {
    message: 'Invalid artist data',
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
 * throw new AppError('No artist data'); // Glides to a 404 with grace
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
 * @param data - The payload to unveil, be it art or apology.
 * @param status - HTTP status, defaulting to a radiant 200.
 * @returns A NextResponse, cloaked in JSON’s charm.
 */
const jsonResponse = (data: object, status: number = 200): NextResponse =>
  NextResponse.json(data, { status });

/**
 * Carves a gallery of artists from Spotify’s raw stone.
 * Ensures each name, image, and link gleams, or fades if flawed.
 * @param data - Spotify’s raw response, rich with promise.
 * @returns A polished array of artist portraits or an error’s sigh.
 */
const formatResponse = (data: ResponseData): ArtistResponse[] => {
  if (!data.items || data.items.length === 0) {
    throw new AppError('No artist data');
  }

  return data.items.map((artist) => {
    if (
      !artist.name ||
      !artist.images[0]?.url ||
      !artist.external_urls.spotify
    ) {
      throw new AppError('Invalid artist data');
    }
    return {
      name: artist.name,
      image: artist.images[0].url,
      url: artist.external_urls.spotify,
    };
  });
};

/**
 * Hunts Spotify’s top artists with patient precision.
 * Draws from the long-term tapestry of user taste.
 * @param accessToken - The key to Spotify’s artistic vault.
 * @returns A promise of raw Spotify data, or an error’s quiet murmur.
 */
const getTopArtistsData = async (
  accessToken: string
): Promise<ResponseData> => {
  const TOP_ARTISTS_URL =
    'https://api.spotify.com/v1/me/top/artists?limit=9&time_range=long_term';

  try {
    return await fetchSpotifyData<ResponseData>(TOP_ARTISTS_URL, accessToken);
  } catch {
    throw new AppError('Failed to fetch data');
  }
};

/**
 * Orchestrates a GET request to summon Spotify’s top artists.
 * Delivers a vivid array of creators or a gentle error’s bow.
 * @returns A JSON response, vibrant with art or softened by grace.
 */
export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new AppError('No access token');
    }

    const topArtistsData = await getTopArtistsData(accessToken);
    return jsonResponse(formatResponse(topArtistsData));
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
