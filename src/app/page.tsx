'use client'

import { SearchBar } from '@/components/search-bar/search-bar'
import { ysabeau } from '@/utils/fonts'

export default function Home() {
  return (
    <div className={`h-full ${ysabeau.className}`}>
      <SearchBar></SearchBar>
    </div>
  )
}
