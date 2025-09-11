import { NextResponse } from 'next/server';
import { getAccessToken } from '../auth';
import { fetchSpotify } from '../fetcher';

const NOW_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

type Track = {
  name: string;
  album: { artists: Array<{ name: string }> };
  external_urls: { spotify: string };
};

type SpotifyResponse = {
  is_playing: boolean;
  currently_playing_type: string;
  item: Track | null;
  items: Array<{ track: Track }>;
};

function formatTrack(data: SpotifyResponse): {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
} {
  const track = data.item ?? data.items?.[0]?.track;

  if (
    !track?.name ||
    !track.album?.artists?.[0]?.name ||
    !track.external_urls?.spotify
  ) {
    throw new Error('Invalid track data');
  }

  return {
    title: track.name,
    artist: track.album.artists[0].name,
    url: track.external_urls.spotify,
    isPlaying: !!data.is_playing,
  };
}

async function getTrackData(accessToken: string): Promise<{
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
}> {
  const fetchTrack = (url: string) =>
    fetchSpotify<SpotifyResponse>(url, accessToken);
  const data = await fetchTrack(NOW_PLAYING_URL).catch(() =>
    fetchTrack(RECENTLY_PLAYED_URL),
  );

  if (data.is_playing && data.currently_playing_type === 'track') {
    return formatTrack(data);
  }

  return formatTrack(await fetchTrack(RECENTLY_PLAYED_URL));
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 },
      );
    }

    const result = await getTrackData(accessToken);

    return NextResponse.json({ ...result, success: true });
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';
    const status = e.includes('Invalid') ? 400 : 500;

    return NextResponse.json({ error: e, success: false }, { status });
  }
}
