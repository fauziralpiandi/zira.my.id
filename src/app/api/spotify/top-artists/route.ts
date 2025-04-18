import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotify } from '@/lib/services';

const LOG_PREFIX = '[Top Artists API]';

type TopArtists = {
  name: string;
  images: Array<{ url: string }>;
  external_urls: {
    spotify: string;
  };
};

type Artist = {
  name: string;
  image: string;
  url: string;
};

type Response = {
  items: Array<TopArtists>;
};

const TOP_ARTISTS_URL =
  'https://api.spotify.com/v1/me/top/artists?limit=9&time_range=long_term';

const formatResponse = (data: Response): Artist[] => {
  if (!data.items || data.items.length === 0) {
    console.error(`${LOG_PREFIX} No artist data available`);
    throw new Error('No artist data');
  }
  return data.items.map((artist) => {
    if (
      !artist.name ||
      !artist.images[0]?.url ||
      !artist.external_urls.spotify
    ) {
      console.error(
        `${LOG_PREFIX} Invalid artist data (${artist.name || 'unknown'})`
      );
      throw new Error('Invalid artist data');
    }
    return {
      name: artist.name,
      image: artist.images[0].url,
      url: artist.external_urls.spotify,
    };
  });
};

const getTopArtists = async (accessToken: string): Promise<Response> => {
  if (!accessToken) {
    console.error(`${LOG_PREFIX} No access token provided`);
    throw new Error('Invalid access token');
  }
  try {
    return await fetchSpotify<Response>(TOP_ARTISTS_URL, accessToken);
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Failed to fetch top artists: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    throw new Error('Spotify API failed');
  }
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error(`${LOG_PREFIX} Failed to obtain access token`);
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 400 }
      );
    }
    const result = await getTopArtists(accessToken);
    return NextResponse.json(formatResponse(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: ${message}`);
    return NextResponse.json(
      { error: message },
      {
        status:
          message.includes('Invalid') || message === 'No artist data'
            ? 400
            : 500,
      }
    );
  }
};
