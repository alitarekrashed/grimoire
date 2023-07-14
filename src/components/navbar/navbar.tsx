'use client'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import styles from './navbar.module.css'

export default function Navbar() {
  return (
    <NavigationMenu.Root className="text-center inline-flex justify-center relative border rounded-lg border-stone-300 bg-stone-800">
      <NavigationMenu.List className="flex justify-center ">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/reference/equipment">
            <span className="block p-2">Equipment</span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <div className="h-full w-[1] border border-stone-300"></div>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/reference/conditions">
            <span className="block p-2">Conditions</span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  )
}
