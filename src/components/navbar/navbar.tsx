'use client'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

export default function Navbar() {
  const navItemStyles = 'block p-2 hover:bg-stone-700 hover:rounded-lg'

  return (
    <NavigationMenu.Root className="text-center inline-flex justify-center relative border rounded-lg border-stone-300 bg-stone-800">
      <NavigationMenu.List className="flex justify-center ">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/reference/equipment">
            <span className={`${navItemStyles}`}>Equipment</span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <div className="h-full w-[1] border border-stone-300"></div>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/reference/conditions">
            <span className={`${navItemStyles}`}>Conditions</span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  )
}
