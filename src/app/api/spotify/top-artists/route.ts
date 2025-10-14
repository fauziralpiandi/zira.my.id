import { NextResponse } from 'next/server';
import { getAccessToken } from '../auth';
import { fetchSpotify } from '../fetcher';

const TOP_ARTISTS_URL =
  'https://api.spotify.com/v1/me/top/artists?limit=9&time_range=long_term';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
};

type Artist = {
  name: string;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
};

type SpotifyResponse = {
  items: Artist[];
};

type TopArtists = {
  name: string;
  image: string;
  url: string;
};

async function getTopArtists(accessToken: string): Promise<TopArtists[]> {
  const data = await fetchSpotify<SpotifyResponse>(
    TOP_ARTISTS_URL,
    accessToken,
  );

  const artists =
    data.items?.filter(
      (artist) =>
        artist.name &&
        artist.images?.length > 0 &&
        artist.external_urls?.spotify,
    ) || [];

  if (!artists.length) {
    throw new Error('No valid artist data');
  }

  return artists.map((artist) => ({
    name: artist.name,
    image: artist.images[0]?.url || '',
    url: artist.external_urls.spotify,
  }));
}

export async function GET(): Promise<NextResponse> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401, headers },
      );
    }

    const result = await getTopArtists(accessToken);

    return NextResponse.json(
      { success: true, ...result },
      { status: 200, headers },
    );
  } catch (err) {
    console.error('GET /spotify/top-artists:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers },
    );
  }
}
