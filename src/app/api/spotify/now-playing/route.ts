import { NextResponse } from 'next/server';
import { getAccessToken, fetchSpotifyData } from '~/lib/services';

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
  item: NowPlaying;
  items: Array<{ track: NowPlaying }>;
};

const SPOTIFY_NOW_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing';
const SPOTIFY_RECENTLY_PLAYED_URL =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const formatResponse = (data: Response) => {
  const track = data.item ?? data.items?.[0]?.track;
  if (!track) {
    throw new Error('No track data available');
  }

  return {
    title: track.name,
    artist: track.album.artists[0]?.name,
    url: track.external_urls.spotify,
    isPlaying: data.is_playing,
  };
};

const getNowPlayingData = async (accessToken: string): Promise<Response> => {
  let data = await fetchSpotifyData<Response>(
    SPOTIFY_NOW_PLAYING_URL,
    accessToken
  );

  if (!data.is_playing || data.currently_playing_type !== 'track') {
    data = await fetchSpotifyData<Response>(
      SPOTIFY_RECENTLY_PLAYED_URL,
      accessToken
    );
  }

  return data;
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();

    try {
      const nowPlayingData = await getNowPlayingData(accessToken);
      return NextResponse.json(formatResponse(nowPlayingData));
    } catch {
      const recentlyPlayedData = await fetchSpotifyData<Response>(
        SPOTIFY_RECENTLY_PLAYED_URL,
        accessToken
      );
      return NextResponse.json(formatResponse(recentlyPlayedData));
    }
  } catch (error) {
    console.error('Failed to fetch Spotify data:', error);
    return NextResponse.json(
      {
        error: 'Unable to retrieve now playing from Spotify.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
