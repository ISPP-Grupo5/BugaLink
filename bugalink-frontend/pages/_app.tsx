import Head from 'next/head';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import { AnimatePresence } from 'framer-motion';

export default function MyApp({ Component, pageProps, router }: AppProps) {
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
        <link rel="apple-touch-icon" href="/icons/icon-apple.png" />
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
      <AnimatePresence mode="wait" initial={false}>
        {/* Base layout for new pages */}
        <Component {...pageProps} key={router.asPath} />
      </AnimatePresence>
    </>
  );
}
