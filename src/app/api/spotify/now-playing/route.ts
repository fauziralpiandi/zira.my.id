import { type NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '../auth';
import { fetchSpotify } from '../fetcher';

const NOW_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
};

type Track = {
  name: string;
  album: { artists: Array<{ name: string }> };
  external_urls: { spotify: string };
};

type SpotifyResponse = {
  is_playing?: boolean;
  currently_playing_type?: string;
  item?: Track | null;
  items?: Array<{ track: Track }>;
};

type NowPlaying = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
};

function formatTrack(data: SpotifyResponse): NowPlaying {
  const track = data.item ?? data.items?.[0]?.track;

  if (
    !track?.name ||
    !track.album?.artists?.length ||
    !track.external_urls?.spotify
  ) {
    throw new Error('Invalid track data');
  }

  return {
    title: track.name,
    artist: track.album.artists.map((a) => a.name).join(', '),
    url: track.external_urls.spotify,
    isPlaying: !!data.is_playing,
  };
}

async function getTrackData(accessToken: string): Promise<NowPlaying> {
  const fetchTrack = (url: string) =>
    fetchSpotify<SpotifyResponse>(url, accessToken);

  let data: SpotifyResponse | null = null;

  try {
    data = await fetchTrack(NOW_PLAYING_URL);
  } catch {
    // will use recently played track instead
  }

  if (data?.is_playing && data.currently_playing_type === 'track') {
    return formatTrack(data);
  }

  const recentTracks = await fetchTrack(RECENTLY_PLAYED_URL);

  return formatTrack(recentTracks);
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

    const result = await getTrackData(accessToken);

    return NextResponse.json(
      { success: true, ...result },
      { status: 200, headers },
    );
  } catch (err) {
    console.error('GET /spotify/now-playing:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers },
    );
  }
}
