import { NextResponse } from 'next/server';

import { getAccessToken, fetchSpotify } from '~/lib/services';

type TopTracks = {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
};

type Track = {
  title: string;
  artist: string;
  cover: string;
  url: string;
};

type Response = {
  items: Array<TopTracks>;
};

const TOP_TRACKS_URL =
  'https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=short_term';

const formatResponse = (data: Response): Track[] => {
  if (!data.items || data.items.length === 0) {
    throw new Error('No data available');
  }
  return data.items.map((track) => {
    if (
      !track.name ||
      !track.artists[0]?.name ||
      !track.album.images[0]?.url ||
      !track.external_urls.spotify
    ) {
      throw new Error('Invalid track data');
    }
    return {
      title: track.name,
      artist: track.artists.map((artist) => artist.name).join(', '),
      cover: track.album.images[0].url,
      url: track.external_urls.spotify,
    };
  });
};

const getTopTracks = async (accessToken: string): Promise<Response> => {
  try {
    return await fetchSpotify<Response>(TOP_TRACKS_URL, accessToken);
  } catch (error) {
    console.error('[Spotify API failed]:', error);
    throw new Error('Spotify API failed');
  }
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    const result = await getTopTracks(accessToken);
    return NextResponse.json(formatResponse(result));
  } catch (error) {
    console.error('[Unknown API error]:', error);
    const errorMessage =
      error instanceof Error &&
      ['No data available', 'Spotify API failed'].includes(error.message)
        ? error.message
        : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
