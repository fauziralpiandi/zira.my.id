import { NextResponse } from 'next/server';
import { getAccessToken, fetchSpotifyData } from '~/lib/services';

type TopTrack = {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
};

type Response = {
  items: Array<TopTrack>;
};

const SPOTIFY_TOP_TRACKS_URL =
  'https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=short_term';

const formatResponse = (data: Response) => {
  return data.items.map((track) => ({
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    cover: track.album.images[0]?.url,
    url: track.external_urls.spotify,
  }));
};

export const GET = async () => {
  try {
    const accessToken = await getAccessToken();
    const data = await fetchSpotifyData<Response>(
      SPOTIFY_TOP_TRACKS_URL,
      accessToken
    );

    const formattedData = formatResponse(data);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch Spotify data:', error);
    return NextResponse.json(
      {
        error: 'Unable to retrieve top tracks from Spotify.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
