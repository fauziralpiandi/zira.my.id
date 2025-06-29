import { NextResponse } from 'next/server';

import { getAccessToken } from '@/lib/services/spotify-auth';
import { fetchSpotify } from '@/lib/services/spotify-fetcher';

const LOG_PREFIX = '[Spotify Now Playing]';

type NowPlaying = {
  name: string;
  album: {
    artists: Array<{ name: string }>;
  };
  external_urls: {
    spotify: string;
  };
};

type Response = {
  is_playing: boolean;
  currently_playing_type: string;
  item: NowPlaying | null;
  items: Array<{ track: NowPlaying }>;
};

type FormattedTrack = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
};

const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const SPOTIFY_RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

function formatResponse(nowPlaying: Response): FormattedTrack {
  const track = nowPlaying.item ?? nowPlaying.items?.[0]?.track;
  if (!track) {
    console.error(`${LOG_PREFIX} Error: No track data available`);
    throw new Error('No track data available');
  }

  if (!track.name || !track.album?.artists?.[0]?.name || !track.external_urls?.spotify) {
    console.error(`${LOG_PREFIX} Error: Incomplete track data`);
    throw new Error('Incomplete track data');
  }

  return {
    title: track.name,
    artist: track.album.artists[0].name,
    url: track.external_urls.spotify,
    isPlaying: !!nowPlaying.is_playing,
  };
}

async function getNowPlaying(accessToken: string): Promise<FormattedTrack> {
  if (!accessToken) {
    console.error(`${LOG_PREFIX} Error: No access token provided`);
    throw new Error('Invalid access token');
  }

  try {
    const nowPlaying = await fetchSpotify<Response>(SPOTIFY_NOW_PLAYING_URL, accessToken);

    if (!nowPlaying.is_playing || nowPlaying.currently_playing_type !== 'track') {
      console.info(`${LOG_PREFIX} Info: No track currently playing, fetching recently played`);
      try {
        const recentlyPlayed = await fetchSpotify<Response>(
          SPOTIFY_RECENTLY_PLAYED_URL,
          accessToken,
        );
        return formatResponse(recentlyPlayed);
      } catch (recentError) {
        console.error(
          `${LOG_PREFIX} Error: Failed to fetch recently played: ${recentError instanceof Error ? recentError.message : 'Unknown error'}`,
        );
        throw new Error('Failed to fetch track data');
      }
    }

    return formatResponse(nowPlaying);
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to fetch now playing: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );

    try {
      const recentlyPlayed = await fetchSpotify<Response>(SPOTIFY_RECENTLY_PLAYED_URL, accessToken);
      return formatResponse(recentlyPlayed);
    } catch (fallbackError) {
      console.error(
        `${LOG_PREFIX} Error: Fallback to recently played failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`,
      );
      throw new Error('Failed to fetch any track data');
    }
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error(`${LOG_PREFIX} Error: Failed to obtain access token`);
      return NextResponse.json({ error: 'Invalid access token' }, { status: 400 });
    }

    const result = await getNowPlaying(accessToken);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: ${message}`);
    return NextResponse.json(
      { error: message },
      {
        status: message.includes('Invalid') || message.includes('No track data') ? 400 : 500,
      },
    );
  }
}
