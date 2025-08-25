import { NextResponse } from 'next/server';
import { getAccessToken } from '../auth';
import { fetchSpotify } from '../fetcher';

const TOP_TRACKS_URL =
  'https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=short_term';

type Track = {
  name: string;
  artists: Array<{ name: string }>;
  album: { images: Array<{ url: string }> };
  external_urls: { spotify: string };
};

async function getTopTracks(
  accessToken: string,
): Promise<{ title: string; artist: string; cover: string; url: string }[]> {
  if (!accessToken) {
    throw new Error('Invalid access token');
  }

  const data = await fetchSpotify<{ items: Track[] }>(
    TOP_TRACKS_URL,
    accessToken,
  );

  if (!data.items?.length) {
    throw new Error('No track data');
  }

  return data.items.map(track => {
    if (
      !track.name ||
      !track.artists[0]?.name ||
      !track.album.images[0]?.url ||
      !track.external_urls.spotify
    ) {
      throw new Error('Invalid track data');
    }

    return {
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      cover: track.album.images[0].url,
      url: track.external_urls.spotify,
    };
  });
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Invalid access token');
    }

    const tracks = await getTopTracks(accessToken);

    return NextResponse.json(tracks);
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: e },
      { status: e.includes('Invalid') ? 400 : 500 },
    );
  }
}
