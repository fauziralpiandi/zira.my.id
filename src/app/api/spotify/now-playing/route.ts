import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotify } from '~/lib/services';

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

const formatResponse = (data: Response) => {
  const track = data.item ?? data.items?.[0]?.track;
  if (!track) {
    throw new Error('Something broke!');
  }
  return {
    title: track.name,
    artist: track.album.artists[0]?.name,
    url: track.external_urls.spotify,
    isPlaying: data.is_playing,
  };
};

const getNowPlaying = async (accessToken: string): Promise<Response> => {
  let nowPlaying = await fetchSpotify<Response>(
    SPOTIFY_NOW_PLAYING_URL,
    accessToken
  );
  if (!nowPlaying.is_playing || nowPlaying.currently_playing_type !== 'track') {
    nowPlaying = await fetchSpotify<Response>(
      SPOTIFY_RECENTLY_PLAYED_URL,
      accessToken
    );
  }
  return nowPlaying;
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    const nowPlaying = await getNowPlaying(accessToken);
    return NextResponse.json(formatResponse(nowPlaying));
  } catch {
    return NextResponse.json({ error: 'Something broke!' }, { status: 500 });
  }
};
