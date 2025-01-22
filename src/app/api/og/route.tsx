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
            backgroundImage: `url('${baseUrl}/imgs/opengraph-background.jpg')`,
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
                <path
                  fill="hsl(50, 95%, 88%)"
                  d="M 271.378906 250.332031 C 252.128906 263.75 228.726562 271.621094 203.484375 271.621094 C 137.835938 271.621094 84.617188 218.402344 84.617188 152.753906 C 84.617188 112.550781 104.574219 77.007812 135.125 55.496094 C 59.972656 58.589844 0 120.492188 0 196.40625 C 0 274.292969 63.140625 337.433594 141.027344 337.433594 C 199.816406 337.433594 250.199219 301.464844 271.378906 250.332031 Z"
                />
                <path
                  fill="hsl(50, 95%, 88%)"
                  d="M 103.621094 124.664062 C 122.871094 111.246094 146.273438 103.378906 171.515625 103.378906 C 237.164062 103.378906 290.382812 156.597656 290.382812 222.246094 C 290.382812 262.449219 270.425781 297.992188 239.875 319.503906 C 315.027344 316.40625 375 254.503906 375 178.59375 C 375 100.707031 311.859375 37.566406 233.972656 37.566406 C 175.183594 37.566406 124.800781 73.535156 103.621094 124.664062 Z"
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
