import React, { ReactNode } from 'react';
import Head from 'next/head';
import Footer from './Footer';
import Navigation from './Navigation';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'BugaLink' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#e5ffea" />
      <meta property="og:title" content="BugaLink" />
      <meta
        property="og:description"
        content="Encuentra a otros usuarios que compartan tu misma ruta y haz que tus viajes sean más inteligentes."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bugalink.vercel.app" />
      <meta property="og:image" content="https://bugalink.vercel.app/api/og" />
      <meta property="og:site_name" content="BugaLink" />
      <meta property="og:locale" content="es_ES" />

      <link rel="shortcut icon" href="/assets/favicon.ico" />
    </Head>
    <Navigation />
    {children}
    <Footer />
  </div>
);

export default Layout;
