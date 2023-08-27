import "@/styles/globals.css";
import "animate.css";
import type { AppProps } from "next/app";

import { Inter } from "next/font/google";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Art Mind</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* description */}
        <meta
          name="description"
          content="Convierte tu hermosa voz en una imagen"
        />
        {/* link rel manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className} border-hue `}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
}
