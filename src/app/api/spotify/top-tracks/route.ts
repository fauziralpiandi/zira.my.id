import { NextResponse } from 'next/server';

import { getAccessToken } from '@/lib/services/spotify-auth';
import { fetchSpotify } from '@/lib/services/spotify-fetcher';

const LOG_PREFIX = '[Spotify Top Tracks]';

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

const TOP_TRACKS_URL = 'https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=short_term';

function formatResponse(data: Response): Track[] {
  if (!data.items || data.items.length === 0) {
    console.error(`${LOG_PREFIX} Error: No track data available`);
    throw new Error('No track data available');
  }
  return data.items.map(track => {
    if (
      !track.name ||
      !track.artists[0]?.name ||
      !track.album.images[0]?.url ||
      !track.external_urls.spotify
    ) {
      console.error(`${LOG_PREFIX} Error: Invalid track data for ${track.name || 'unknown track'}`);
      throw new Error('Invalid track data');
    }
    return {
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      cover: track.album.images[0].url,
      url: track.external_urls.spotify,
    };
  });
}

async function getTopTracks(accessToken: string): Promise<Response> {
  if (!accessToken) {
    console.error(`${LOG_PREFIX} Error: No access token provided`);
    throw new Error('Invalid access token');
  }
  try {
    return await fetchSpotify<Response>(TOP_TRACKS_URL, accessToken);
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to fetch top tracks: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    throw new Error('Spotify API request failed');
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error(`${LOG_PREFIX} Error: Failed to obtain access token`);
      return NextResponse.json({ error: 'Invalid access token' }, { status: 400 });
    }
    const result = await getTopTracks(accessToken);
    return NextResponse.json(formatResponse(result));
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
