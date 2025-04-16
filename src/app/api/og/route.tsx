import { ImageResponse } from 'next/og';

import { constant } from '~/lib/constant';

export const runtime = 'edge';

const size = {
  width: 1200,
  height: 630,
};

export const GET = async (request: Request) => {
  try {
    // const { baseUrl, description, authorName } = constant;
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title') : constant.title;

    const extraBold = await fetch(
      new URL('public/fonts/SofiaSans-ExtraBold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());
    const semiBold = await fetch(
      new URL('public/fonts/SofiaSans-SemiBold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());
    const regular = await fetch(
      new URL(
        'public/fonts/SofiaSansSemiCondensed-Regular.ttf',
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(<>{title}</>, {
      ...size,
      fonts: [
        {
          name: 'Custom',
          data: extraBold,
          weight: 800,
          style: 'normal',
        },
        {
          name: 'Custom',
          data: semiBold,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'Custom',
          data: regular,
          weight: 400,
          style: 'normal',
        },
      ],
    });
  } catch {
    return new Response(`Failed to generate the OpenGraph`, {
      status: 500,
    });
  }
};
