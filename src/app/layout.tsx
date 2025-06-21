import { Providers } from '@/providers/Providers'
import type { Metadata } from 'next'
import { Open_Sans, Roboto } from 'next/font/google'
import { type JSX } from 'react'
import './globals.css'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin']
})

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'TechStore - Tu tienda de tecnología y zapatillas',
  description:
    'Encuentra los mejores productos de tecnología y zapatillas en TechStore'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <html lang="es">
      <body className={`${openSans.variable} ${roboto.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
