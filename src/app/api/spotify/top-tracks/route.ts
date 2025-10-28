import { NextResponse } from 'next/server';
import { getAccessToken, fetchSpotify } from '@/lib/spotify';

const URL =
  'https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=short_term';
const HEADERS = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
};

type Track = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

type TopTrack = {
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
};

const getTopTracks = async (token: string): Promise<TopTrack[]> => {
  const { items } = await fetchSpotify<{ items: Track[] }>(URL, token);

  if (!items?.length) return [];

  return items.map((track) => ({
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    cover: track.album.images[0].url,
    url: track.external_urls.spotify,
  }));
};

export async function GET() {
  const token = await getAccessToken();

  if (!token)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: HEADERS },
    );

  try {
    const result = await getTopTracks(token);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200, headers: HEADERS },
    );
  } catch (err) {
    console.error('GET /spotify/top-tracks:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: HEADERS },
    );
  }
}
