import { Html, Head, Main, NextScript } from 'next/document';

// Added this file because of this warning: https://nextjs.org/docs/messages/no-stylesheets-in-head-component
export default function Document() {
  return (
    <Html>
      <Head>
        {/* Lato font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@200;400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
