// https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import Logo from '/public/assets/Logo.svg';

export const config = {
  runtime: 'edge',
};

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'BugaLink';

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#57cc99',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            color: '#fff',
          }}
        >
          <Logo
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            <Logo
              alt="BugaLink"
              height={200}
              style={{ margin: '0 30px' }}
              width={232}
            />
          </Logo>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
