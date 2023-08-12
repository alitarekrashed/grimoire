'use client'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import React from 'react'
import { SearchBar } from '../search-bar/search-bar'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const navItemStyles = 'block p-2'
  const path: string[] = usePathname().split('/')

  const navItems = [
    {
      title: 'Home',
      link: '/',
      className:
        path.length === 1 && path[0] === ''
          ? 'bg-rose-800 hover:bg-rose-500 rounded-l-lg'
          : 'rounded-l-lg hover:bg-stone-600',
    },
    {
      title: 'Characters',
      link: '/characters',
      className:
        path[path.length - 1] === 'characters'
          ? 'bg-rose-800 hover:bg-rose-500'
          : 'hover:bg-stone-600',
    },
    {
      title: 'Equipment',
      link: '/reference/equipment',
      className:
        path[path.length - 1] === 'equipment'
          ? 'bg-rose-800 hover:bg-rose-500'
          : 'hover:bg-stone-600',
    },
    {
      title: 'Spells',
      link: '/reference/spells',
      className:
        path[path.length - 1] === 'spells'
          ? 'bg-rose-800 hover:bg-rose-500'
          : 'hover:bg-stone-600',
    },
    {
      title: 'Conditions',
      link: '/reference/conditions',
      className:
        path[path.length - 1] === 'conditions'
          ? 'bg-rose-800 hover:bg-rose-500'
          : 'hover:bg-stone-600',
    },
    {
      title: 'Traits',
      link: '/reference/traits',
      className:
        path[path.length - 1] === 'traits'
          ? 'bg-rose-800 hover:bg-rose-500'
          : 'hover:bg-stone-600',
    },
  ]

  return (
    <NavigationMenu.Root className="text-center inline-flex justify-center relative border rounded-lg border-stone-300 bg-stone-800">
      <NavigationMenu.List className="flex justify-center ">
        {navItems.map((item, index) => {
          return (
            <React.Fragment key={item.title}>
              <NavigationMenu.Item>
                <NavigationMenu.Link href={item.link}>
                  <span className={`${navItemStyles} ${item.className}`}>
                    {item.title}
                  </span>
                </NavigationMenu.Link>
              </NavigationMenu.Item>

              {index < navItems.length - 1 && (
                <NavigationMenu.Item>
                  <div className="h-full w-[1] border border-stone-300"></div>
                </NavigationMenu.Item>
              )}
            </React.Fragment>
          )
        })}
        <NavigationMenu.Item>
          <div className="h-full w-[1] border border-stone-300"></div>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <SearchBar size="small"></SearchBar>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  )
}
