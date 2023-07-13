import './globals.css'
import type { Metadata } from 'next'
import { dm_serif_display } from '../utils/fonts'

export const metadata: Metadata = {
  title: 'grimoire',
  description: 'A digital toolset for TTRPGs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${dm_serif_display.className} bg-gradient-to-t from-zinc-700 via-zinc-900 to-black`}
      >
        {children}
      </body>
    </html>
  )
}
