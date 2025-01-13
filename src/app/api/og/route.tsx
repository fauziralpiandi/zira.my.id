import { ImageResponse } from 'next/og';

import { constant } from '~/lib/constant';
import { Logo } from '~/components/ui';

export const runtime = 'edge';

export const GET = async (request: Request) => {
  try {
    const { baseUrl, authorName } = constant;
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : '~';

    const extraBold = await fetch(
      new URL('public/fonts/Recursive-ExtraBold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());
    const semiBold = await fetch(
      new URL('public/fonts/Recursive-SemiBold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());
    const regular = await fetch(
      new URL('public/fonts/Geist-Regular.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
            padding: '2rem 4rem',
            backgroundImage: `url('${baseUrl}/imgs/opengraph-background.jpg')`,
            backgroundSize: '1200px 630px',
            backgroundPosition: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1
              style={{
                fontSize: '3.75rem',
                fontWeight: '800',
                letterSpacing: '-0.025em',
                lineHeight: '1.25',
                color: '#fffbeb',
              }}
            >
              {title}
            </h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Logo width={96} height={96} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '1.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '1.875rem',
                    letterSpacing: '-0.025em',
                    fontWeight: '600',
                    color: '#fffbeb',
                  }}
                >
                  {authorName} ~
                </span>
                <span
                  style={{
                    fontSize: '1.5rem',
                    color: '#d6d3d1',
                  }}
                >
                  An enthusiastic frontend developer with a passionate
                  storyteller&mdash;
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
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
      }
    );
  } catch (e) {
    console.log((e as { message: string }).message);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};
