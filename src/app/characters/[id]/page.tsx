'use client'

import { CharacterSheet } from '@/components/character-display/character-sheet'
import { PlayerCharacterProvider } from '@/components/character-display/player-character-context'
import { PlayerCharacter } from '@/models/player-character'
import { usePathname } from 'next/navigation'

export default function CharacterPage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  return (
    <div className={`h-screen w-screen overflow-y-scroll`}>
      <PlayerCharacterProvider>
        <CharacterSheet id={id}></CharacterSheet>
      </PlayerCharacterProvider>
    </div>
  )
}
