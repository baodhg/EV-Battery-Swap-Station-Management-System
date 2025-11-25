import type { Metadata } from "next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { GoogleOAuthProvider } from "@react-oauth/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "EVSwap",  
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GoogleOAuthProvider clientId="691424301921-q6uuf035t3ta88cs6cg0es194eulno1u.apps.googleusercontent.com">
          {children}
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
