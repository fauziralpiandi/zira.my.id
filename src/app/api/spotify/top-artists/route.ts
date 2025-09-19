import { NextResponse } from 'next/server';
import { getAccessToken } from '../auth';
import { fetchSpotify } from '../fetcher';

const TOP_ARTISTS_URL =
  'https://api.spotify.com/v1/me/top/artists?limit=9&time_range=long_term';

type Artist = {
  name: string;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
};

async function getTopArtists(
  accessToken: string,
): Promise<{ name: string; image: string; url: string }[]> {
  const data = await fetchSpotify<{ items: Artist[] }>(
    TOP_ARTISTS_URL,
    accessToken,
  );

  const artists =
    data.items?.filter(
      artist =>
        artist.name &&
        artist.images?.length > 0 &&
        artist.external_urls?.spotify,
    ) || [];

  if (!artists.length) {
    throw new Error('No valid artist data');
  }

  return artists.map(artist => ({
    name: artist.name,
    image: artist.images[0]?.url || '',
    url: artist.external_urls.spotify,
  }));
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required', success: false },
        { status: 400 },
      );
    }

    const artists = await getTopArtists(accessToken);

    return NextResponse.json(artists, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    });
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';
    const status = e.includes('Invalid') || e.includes('No valid') ? 400 : 500;

    return NextResponse.json({ error: e, success: false }, { status });
  }
}
