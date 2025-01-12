import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotifyData } from '~/lib/services';

type TopArtist = {
  name: string;
  images: Array<{ url: string }>;
  external_urls: {
    spotify: string;
  };
};

type Response = {
  items: Array<TopArtist>;
};

const SPOTIFY_TOP_ARTISTS_URL =
  'https://api.spotify.com/v1/me/top/artists?limit=9&time_range=long_term';

const formatResponse = (data: Response) => {
  return data.items.map((artist) => ({
    name: artist.name,
    image: artist.images[0]?.url,
    url: artist.external_urls.spotify,
  }));
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    const data = await fetchSpotifyData<Response>(
      SPOTIFY_TOP_ARTISTS_URL,
      accessToken
    );

    return NextResponse.json(formatResponse(data));
  } catch (error) {
    console.error('Failed to fetch Spotify data:', error);
    return NextResponse.json(
      {
        error: 'Unable to retrieve top artists from Spotify.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
