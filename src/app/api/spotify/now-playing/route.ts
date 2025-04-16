import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotify } from '~/lib/services';

const LOG_PREFIX = '[Now Playing API]';

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

const SPOTIFY_NOW_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing';
const SPOTIFY_RECENTLY_PLAYED_URL =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const formatResponse = (nowPlaying: Response) => {
  const track = nowPlaying.item ?? nowPlaying.items?.[0]?.track;
  if (!track) {
    console.error(`${LOG_PREFIX} No track data available`);
    throw new Error('No track data');
  }

  return {
    title: track.name,
    artist: track.album.artists[0].name,
    url: track.external_urls.spotify,
    isPlaying: nowPlaying.is_playing,
  };
};

const getNowPlaying = async (accessToken: string) => {
  if (!accessToken) {
    console.error(`${LOG_PREFIX} No access token provided`);
    throw new Error('Invalid access token');
  }

  try {
    const nowPlaying = await fetchSpotify<Response>(
      SPOTIFY_NOW_PLAYING_URL,
      accessToken
    );

    if (
      !nowPlaying.is_playing ||
      nowPlaying.currently_playing_type !== 'track'
    ) {
      console.log(`${LOG_PREFIX} Offline, fetching recently played`);
      const recentlyPlayed = await fetchSpotify<Response>(
        SPOTIFY_RECENTLY_PLAYED_URL,
        accessToken
      );
      return formatResponse(recentlyPlayed);
    }

    return formatResponse(nowPlaying);
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Failed to fetch now playing: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    const recentlyPlayed = await fetchSpotify<Response>(
      SPOTIFY_RECENTLY_PLAYED_URL,
      accessToken
    );
    return formatResponse(recentlyPlayed);
  }
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error(`${LOG_PREFIX} Failed to obtain access token`);
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 400 }
      );
    }

    const result = await getNowPlaying(accessToken);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: ${message}`);
    return NextResponse.json(
      { error: message },
      {
        status:
          message.includes('Invalid') || message === 'No track data'
            ? 400
            : 500,
      }
    );
  }
};
