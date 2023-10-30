'use client'
import { PlayerCharacterProvider } from '@/components/character-display/player-character-context'
import { SearchBar } from '@/components/search-bar/search-bar'
import { ysabeau } from '@/utils/fonts'

export default function Home() {
  return (
    <div className={`h-full ${ysabeau.className}`}>
      <PlayerCharacterProvider></PlayerCharacterProvider>
      <SearchBar></SearchBar>
    </div>
  )
}
