import { type NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '../auth';
import { fetchSpotify } from '../fetcher';

const TOP_TRACKS_URL =
  'https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=short_term';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
};

type Track = {
  name: string;
  artists: Array<{ name: string }>;
  album: { images: Array<{ url: string }> };
  external_urls: { spotify: string };
};

type SpotifyResponse = {
  items: Track[];
};

type TopTracks = {
  title: string;
  artist: string;
  cover: string;
  url: string;
};

async function getTopTracks(accessToken: string): Promise<TopTracks[]> {
  const data = await fetchSpotify<SpotifyResponse>(TOP_TRACKS_URL, accessToken);
  const tracks =
    data.items?.filter(
      (track) =>
        track.name &&
        track.artists?.length > 0 &&
        track.album?.images?.length > 0 &&
        track.external_urls?.spotify,
    ) || [];

  if (!tracks.length) {
    throw new Error('No valid track data');
  }

  return tracks.map((track) => ({
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    cover: track.album.images[0]?.url || '',
    url: track.external_urls.spotify,
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

    const result = await getTopTracks(accessToken);

    return NextResponse.json(
      { success: true, result },
      { status: 200, headers },
    );
  } catch (err) {
    console.error('GET /spotify/top-tracks:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers },
    );
  }
}
