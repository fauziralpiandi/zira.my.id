import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotifyData } from '~/lib/services';

type NowPlaying = {
  name: string;
  album: {
    artists: Array<{ name: string }>;
  };
  external_urls: {
    spotify: string;
  };
};

type ResponseData = {
  is_playing: boolean;
  currently_playing_type: string;
  item?: NowPlaying;
  items?: Array<{ track: NowPlaying }>;
};

type TrackResponse = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
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
    message: 'No track data found',
    status: 404,
  },
  'Failed to fetch data': {
    message: 'Failed to fetch Spotify data',
    status: 500,
  },
  'Invalid track data': {
    message: 'Invalid track data',
    status: 500,
  },
} as const;

type KnownErrorKey = keyof typeof LOGGING;

/**
 * A custom error, crafted to dance with LOGGING’s rhythm.
 * Ensures every misstep yields a graceful message and status.
 * @example
 * throw new AppError('No track data'); // Sways to a 404 with elegance
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
 * Weaves a JSON response with poise and precision.
 * Every reply carries a consistent melody, ready for the client’s ears.
 * @param data - The payload to serenade, be it song or sorrow.
 * @param status - HTTP status, defaulting to a harmonious 200.
 * @returns A NextResponse, dressed in JSON’s finest.
 */
const jsonResponse = (data: object, status: number = 200): NextResponse =>
  NextResponse.json(data, { status });

/**
 * Paints a track’s essence from Spotify’s raw canvas.
 * Ensures the tune’s title, artist, and link shine through, or bows out if they don’t.
 * @param data - Spotify’s raw response, brimming with potential.
 * @returns A polished track response or an error’s lament.
 */
const formatResponse = (data: ResponseData): TrackResponse => {
  const track = data.item ?? data.items?.[0]?.track;
  if (!track || !track.name || !track.external_urls.spotify) {
    throw new AppError('No track data');
  }
  if (!track.album.artists[0]?.name) {
    throw new AppError('Invalid track data');
  }

  return {
    title: track.name,
    artist: track.album.artists[0].name,
    url: track.external_urls.spotify,
    isPlaying: data.is_playing,
  };
};

/**
 * Seeks Spotify’s current or recent tune with quiet anticipation.
 * Falls back to recent tracks if no song plays now, ever resilient.
 * @param accessToken - The key to Spotify’s musical vault.
 * @returns A promise of raw Spotify data, or an error’s soft whisper.
 */
const getNowPlayingData = async (
  accessToken: string
): Promise<ResponseData> => {
  const NOW_PLAYING_URL =
    'https://api.spotify.com/v1/me/player/currently-playing';
  const RECENTLY_PLAYED_URL =
    'https://api.spotify.com/v1/me/player/recently-played?limit=1';

  try {
    let data = await fetchSpotifyData<ResponseData>(
      NOW_PLAYING_URL,
      accessToken
    );
    if (!data.is_playing || data.currently_playing_type !== 'track') {
      data = await fetchSpotifyData<ResponseData>(
        RECENTLY_PLAYED_URL,
        accessToken
      );
    }
    return data;
  } catch {
    throw new AppError('Failed to fetch data');
  }
};

/**
 * Conducts a GET request to capture Spotify’s current or recent song.
 * Delivers a formatted track’s soul or an error’s gentle apology.
 * @returns A JSON response, alive with music or marked by grace in failure.
 */
export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new AppError('No access token');
    }

    const nowPlayingData = await getNowPlayingData(accessToken);
    return jsonResponse(formatResponse(nowPlayingData));
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
