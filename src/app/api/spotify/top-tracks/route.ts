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
    throw new Error('Something broke!');
  }
  return data.items.map((track) => {
    if (
      !track.name ||
      !track.artists[0]?.name ||
      !track.album.images[0]?.url ||
      !track.external_urls.spotify
    ) {
      throw new Error('Something broke!');
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
  return await fetchSpotify<Response>(TOP_TRACKS_URL, accessToken);
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Something broke!');
    }
    const topTracks = await getTopTracks(accessToken);
    return NextResponse.json(formatResponse(topTracks));
  } catch {
    return NextResponse.json({ error: 'Something broke!' }, { status: 500 });
  }
};
