'use client'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

export default function Navbar() {
  const navItemStyles = 'block p-2 hover:bg-stone-700 hover:rounded-lg'

  const navItems = [
    {
      title: 'Equipment',
      link: '/reference/equipment',
    },
    {
      title: 'Conditions',
      link: '/reference/conditions',
    },
    {
      title: 'Traits',
      link: '/reference/traits',
    },
  ]

  return (
    <NavigationMenu.Root className="text-center inline-flex justify-center relative border rounded-lg border-stone-300 bg-stone-800">
      <NavigationMenu.List className="flex justify-center ">
        {navItems.map((item, index) => {
          return (
            <>
              <NavigationMenu.Item>
                <NavigationMenu.Link href={item.link}>
                  <span className={`${navItemStyles}`}>{item.title}</span>
                </NavigationMenu.Link>
              </NavigationMenu.Item>

              {index < navItems.length - 1 && (
                <NavigationMenu.Item>
                  <div className="h-full w-[1] border border-stone-300"></div>
                </NavigationMenu.Item>
              )}
            </>
          )
        })}
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  )
}
