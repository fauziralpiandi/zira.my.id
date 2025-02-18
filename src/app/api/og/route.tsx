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
                viewBox="0 0 375 375"
                width="96"
                height="96"
              >
                <path
                  fill="#fef3c7"
                  d="M213.21 193.42L253.34 153.29L203.14 103.09C181.68 81.63 146.88 81.63 125.42 103.09L0 228.51L80.65 229.09L164.77 144.97Z"
                />
                <path
                  fill="#fef3c7"
                  d="M296.30 146.35L213.21 229.43L165.25 181.47L125.12 221.60L177.34 273.82C196.88 293.36 228.57 293.36 248.11 273.82L375.02 146.93Z"
                />
              </svg>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '1.65rem',
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
