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
  if (!accessToken) {
    throw new Error('Invalid access token');
  }

  const data = await fetchSpotify<{ items: Artist[] }>(
    TOP_ARTISTS_URL,
    accessToken,
  );

  if (!data.items?.length) {
    throw new Error('No artist data');
  }

  return data.items.map(artist => {
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
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Invalid access token');
    }

    const artists = await getTopArtists(accessToken);

    return NextResponse.json(artists);
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: e },
      { status: e.includes('Invalid') ? 400 : 500 },
    );
  }
}
