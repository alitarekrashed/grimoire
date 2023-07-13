import './globals.css'
import type { Metadata } from 'next'
import { dm_serif_display } from '../utils/fonts'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

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
        className={`${dm_serif_display.className} bg-gradient-to-t from-zinc-700 via-zinc-900 to-black h-screen`}
      >
        <div className="h-1/6 flex justify-center ">
          <h1 className="pt-5 mb-4 text-5xl">grimoire</h1>
        </div>

        {/* <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger />
              <NavigationMenu.Content>
                <NavigationMenu.Link />
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link />
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger />
              <NavigationMenu.Content>
                <NavigationMenu.Sub>
                  <NavigationMenu.List />
                  <NavigationMenu.Viewport />
                </NavigationMenu.Sub>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Indicator />
          </NavigationMenu.List>

          <NavigationMenu.Viewport />
        </NavigationMenu.Root> */}

        <div className="h-5/6"> {children}</div>
      </body>
    </html>
  )
}
