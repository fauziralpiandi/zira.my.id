import { ImageResponse } from 'next/og';

import { constant } from '~/lib/constant';

export const runtime = 'edge';

export const GET = async (request: Request) => {
  try {
    const { baseUrl, description, authorName } = constant;
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
            backgroundImage: `url('${baseUrl}/imgs/opengraph.jpg')`,
            backgroundSize: '1200px 630px',
            backgroundPosition: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1
              style={{
                fontSize: '4rem',
                fontWeight: '800',
                lineHeight: '1.25',
                color: '#fffbeb',
              }}
            >
              {title}
            </h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 375 375"
                width="96"
                height="96"
              >
                <circle cx="187.5" cy="187.5" r="187.5" fill="hsl(0, 0%, 8%)" />
                <path
                  fill="hsl(48, 96%, 87%)"
                  d="M247.9 232.74c-13.86 9.66-30.71 15.33-48.89 15.33-47.27 0-85.59-38.32-85.59-85.59 0-28.95 14.37-54.54 36.36-70.03-54.11 2.23-97.29 46.8-97.29 101.46 0 56.08 45.46 101.54 101.54 101.54 42.33 0 78.61-25.9 93.85-62.72z"
                />
                <path
                  fill="hsl(48, 96%, 87%)"
                  d="M127.1 142.26c13.86-9.66 30.71-15.33 48.89-15.33 47.27 0 85.59 38.32 85.59 85.59 0 28.95-14.37 54.54-36.36 70.03 54.11-2.23 97.29-46.8 97.29-101.46 0-56.08-45.46-101.54-101.54-101.54-42.33 0-78.61 25.9-93.85 62.72z"
                />
              </svg>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '1.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: '600',
                    color: '#fffbeb',
                  }}
                >
                  {authorName}
                </span>
                <span
                  style={{
                    fontSize: '1.75rem',
                    color: '#d4d4d4',
                  }}
                >
                  {description}
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
