'use client'

import { CharacterSheet } from '@/components/character-display/character-sheet'
import { usePathname } from 'next/navigation'

export default function CharacterPage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  return (
    <div className={`h-screen w-screen overflow-y-scroll`}>
      <CharacterSheet id={id}></CharacterSheet>
    </div>
  )
}
