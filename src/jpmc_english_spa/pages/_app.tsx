"use client"

import type { AppProps } from "next/app"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "@/styles/globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${geist.style.fontFamily};
          --font-mono: ${geistMono.style.fontFamily};
        }
      `}</style>
      <div className="font-sans antialiased">
        <Component {...pageProps} />
        <Analytics />
      </div>
    </>
  )
}
