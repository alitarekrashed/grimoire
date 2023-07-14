'use client'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import styles from './navbar.module.css'

export default function Navbar() {
  return (
    <NavigationMenu.Root className="h-full">
      <NavigationMenu.List className="h-full inline-flex rounded bg-stone-800 border border-stone-300">
        <NavigationMenu.Item className="m-2">
          <NavigationMenu.Link href="/reference/equipment">
            Equipment
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <div className="h-full w-[2] border border-stone-300"></div>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="m-2">
          <NavigationMenu.Link href="/reference/conditions">
            Conditions
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  )
}
