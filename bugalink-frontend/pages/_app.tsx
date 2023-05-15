import MobileLayout from '@/components/layouts/mobile';
import '@/styles/carousel.css';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { NotificationManager } from '@/components/notifications/NotificationManager';

export default function MyApp({
  Component,
  router,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,viewport-fit=cover,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="theme-color" content="#38A3A5" />
        <meta name="description" content="Better carpooling" />
        <meta name="keywords" content="carpooling" />
        <title>BugaLink</title>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/icon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
          integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
          crossOrigin=""
        ></script>
        {/* Avoid black notch in iOS devices */}
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta property="og:title" content="BugaLink" />
        <meta
          property="og:description"
          content="Encuentra a otros usuarios que compartan tu misma ruta y haz que tus viajes sean más inteligentes."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bugalink.vercel.app" />
        <meta
          property="og:image"
          content="https://bugalink.vercel.app/api/og"
        />
        <meta property="og:site_name" content="BugaLink" />
        <meta property="og:locale" content="es_ES" />
      </Head>
      {/* Base layout for new pages */}
      <SessionProvider session={session}>
        <MobileLayout key={router.asPath}>
          <NotificationManager />
          <Component {...pageProps} />
        </MobileLayout>
      </SessionProvider>
    </>
  );
}
