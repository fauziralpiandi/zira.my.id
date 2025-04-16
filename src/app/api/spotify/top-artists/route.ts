import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotify } from '~/lib/services';

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
    throw new Error('No data available');
  }
  return data.items.map((artist) => {
    if (
      !artist.name ||
      !artist.images[0]?.url ||
      !artist.external_urls.spotify
    ) {
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
  try {
    return await fetchSpotify<Response>(TOP_ARTISTS_URL, accessToken);
  } catch (error) {
    console.error('[Spotify API failed]:', error);
    throw new Error('Spotify API failed');
  }
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    const result = await getTopArtists(accessToken);
    return NextResponse.json(formatResponse(result));
  } catch (error) {
    console.error('[Unknown API error]:', error);
    const errorMessage =
      error instanceof Error &&
      ['No data available', 'Spotify API failed'].includes(error.message)
        ? error.message
        : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
