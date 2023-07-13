import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AppHeader from '../components/app-header';
import AppFooter from '../components/app-footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vellera Yarns',
  description: 'Vellera Yarns - A local yarn shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} box-border p-0 m-0 bg-gradient-to-b from-stone-950 via-stone-950 to-stone-700`}>
        <AppHeader />
          {children}
        <AppFooter />
      </body>
    </html>
  )
}
