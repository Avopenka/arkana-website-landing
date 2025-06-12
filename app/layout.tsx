import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arkana - Advanced AI Intelligence Platform',
  description: 'Advanced AI that adapts to behavioral patterns, emotional context, and communication styles using machine learning and natural language processing.',
  metadataBase: new URL('https://arkana.chat'),
  openGraph: {
    title: 'Arkana - Advanced AI Intelligence Platform',
    description: 'Experience AI that adapts to your behavioral patterns and communication style',
    url: 'https://arkana.chat',
    siteName: 'Arkana',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arkana - Advanced AI Intelligence Platform',
    description: 'Experience AI that adapts to your behavioral patterns and communication style',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
