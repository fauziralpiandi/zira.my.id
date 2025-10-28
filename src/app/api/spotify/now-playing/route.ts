import { NextResponse } from 'next/server';
import { getAccessToken, fetchSpotify } from '@/lib/spotify';

const CURRENTLY_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const HEADERS = { 'Cache-Control': 'no-store' };

type Track = {
  name: string;
  album: { artists: { name: string }[] };
  external_urls: { spotify: string };
};

type NowPlaying = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
};

const formatTrack = (track: Track, isPlaying: boolean): NowPlaying => ({
  title: track.name,
  artist: track.album.artists.map((artist) => artist.name).join(', '),
  url: track.external_urls.spotify,
  isPlaying,
});

const getTrackData = async (token: string): Promise<NowPlaying> => {
  const fetchTrack = async (url: string) =>
    fetchSpotify<{
      is_playing: boolean;
      currently_playing_type: string;
      item: Track;
      items: Array<{ track: Track }>;
    }>(url, token);

  const now = await fetchTrack(CURRENTLY_PLAYING_URL).catch(() => null);

  if (now?.is_playing && now.currently_playing_type === 'track' && now.item) {
    return formatTrack(now.item, true);
  }

  const recent = await fetchTrack(RECENTLY_PLAYED_URL);

  if (!recent.items?.[0]?.track) {
    return {
      title: '~',
      artist: '~',
      url: 'https://open.spotify.com',
      isPlaying: false,
    };
  }

  return formatTrack(recent.items[0].track, false);
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
    const result = await getTrackData(token);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200, headers: HEADERS },
    );
  } catch (err) {
    console.error('GET /spotify/now-playing:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: HEADERS },
    );
  }
}
