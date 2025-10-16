import { NextResponse } from 'next/server';
import { getAccessToken, fetchSpotify } from '../handler';

const URL =
  'https://api.spotify.com/v1/me/top/artists?limit=9&time_range=long_term';
const HEADERS = {
  'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=3600',
};

type Artist = {
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
};

type TopArtists = {
  name: string;
  image: string;
  url: string;
};

const getTopArtists = async (token: string): Promise<TopArtists[]> => {
  const { items } = await fetchSpotify<{ items: Artist[] }>(URL, token);

  if (!items.length) return [];

  return items.map((artist) => ({
    name: artist.name,
    image: artist.images[0].url,
    url: artist.external_urls.spotify,
  }));
};

export async function GET(): Promise<NextResponse> {
  const token = await getAccessToken();

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: HEADERS },
    );
  }

  try {
    const result = await getTopArtists(token);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200, headers: HEADERS },
    );
  } catch (err) {
    console.error('GET /spotify/top-artists:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: HEADERS },
    );
  }
}
