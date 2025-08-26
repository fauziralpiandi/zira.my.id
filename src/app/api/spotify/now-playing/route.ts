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

async function getTrackData(
  accessToken: string,
): Promise<{ title: string; artist: string; url: string; isPlaying: boolean }> {
  if (!accessToken) {
    throw new Error('Invalid access token');
  }

  const fetchTrack = async (url: string): Promise<SpotifyResponse> => {
    try {
      return await fetchSpotify<SpotifyResponse>(url, accessToken);
    } catch {
      throw new Error('Failed to fetch track data');
    }
  };

  const formatTrack = (
    data: SpotifyResponse,
  ): { title: string; artist: string; url: string; isPlaying: boolean } => {
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
  };

  try {
    const nowPlaying = await fetchTrack(NOW_PLAYING_URL);

    if (
      nowPlaying.is_playing &&
      nowPlaying.currently_playing_type === 'track'
    ) {
      return formatTrack(nowPlaying);
    }

    return formatTrack(await fetchTrack(RECENTLY_PLAYED_URL));
  } catch {
    return formatTrack(await fetchTrack(RECENTLY_PLAYED_URL));
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Invalid access token');
    }

    const result = await getTrackData(accessToken);

    return NextResponse.json(result);
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: e },
      { status: e.includes('Invalid') ? 400 : 500 },
    );
  }
}
