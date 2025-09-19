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
  const data = await fetchSpotify<{ items: Track[] }>(
    TOP_TRACKS_URL,
    accessToken,
  );

  const tracks =
    data.items?.filter(
      track =>
        track.name &&
        track.artists?.length > 0 &&
        track.album?.images?.length > 0 &&
        track.external_urls?.spotify,
    ) || [];

  if (!tracks.length) {
    throw new Error('No valid track data');
  }

  return tracks.map(track => ({
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    cover: track.album.images[0]?.url || '',
    url: track.external_urls.spotify,
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

    const tracks = await getTopTracks(accessToken);

    return NextResponse.json(
      { tracks, success: true },
      {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
      },
    );
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';
    const status = e.includes('Invalid') || e.includes('No valid') ? 400 : 500;

    return NextResponse.json({ error: e, success: false }, { status });
  }
}
