import './globals.css'
import Navbar from '@/components/navbar/navbar'
import type { Metadata } from 'next'
import { dm_serif_display, ysabeau } from '../utils/fonts'

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
        className={`${dm_serif_display.className} bg-gradient-to-t from-stone-950 to-stone-900 min-h-screen flex wrap flex-col`}
      >
        <div className="grid grid-cols-1 pt-5 w-full">
          <div
            className={`mb-4 ${ysabeau.className} flex self-center justify-self-center`}
          >
            <Navbar></Navbar>
          </div>
        </div>

        <div className="h-5/6 grow relative">{children}</div>
      </body>
    </html>
  )
}
