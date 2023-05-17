import "@/styles/globals.css";
import "animate.css";
import type { AppProps } from "next/app";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className} border-hue `}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
}
