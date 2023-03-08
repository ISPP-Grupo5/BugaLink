import { ImageResponse } from '@vercel/og';
import Logo from '/public/icons/Bugalink.svg';

export const config = {
  runtime: 'edge',
};

// This component handles the generation of the thumbnail images that appear when you share a link on social media.
// https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images

export default function handler() {
  try {
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
  } catch (e: unknown) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
