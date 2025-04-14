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
    throw new Error('Something broke!');
  }
  return data.items.map((artist) => {
    if (
      !artist.name ||
      !artist.images[0]?.url ||
      !artist.external_urls.spotify
    ) {
      throw new Error('Something broke!');
    }
    return {
      name: artist.name,
      image: artist.images[0].url,
      url: artist.external_urls.spotify,
    };
  });
};

const getTopArtists = async (accessToken: string): Promise<Response> => {
  return await fetchSpotify<Response>(TOP_ARTISTS_URL, accessToken);
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Something broke!');
    }
    const topArtists = await getTopArtists(accessToken);
    return NextResponse.json(formatResponse(topArtists));
  } catch {
    return NextResponse.json({ error: 'Something broke!' }, { status: 500 });
  }
};
