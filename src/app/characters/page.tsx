'use client'

import { LabelsList } from '@/components/labels-list/labels-list'
import { Character } from '@/models/character'
import { roboto_serif } from '@/utils/fonts'
import { useEffect, useState } from 'react'

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/characters', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((characters) => {
        setCharacters(characters)
      })
  }, [])

  return (
    <div className={`h-full ${roboto_serif.className}`}>
      <h1>Characters list!</h1>
      {characters.map((character) => {
        return (
          <div key={character._id.toString()}>
            <LabelsList
              fieldDefinitions={[
                {
                  label: 'Name',
                  value: character.name,
                },
                {
                  label: 'Level',
                  value: character.level,
                },
                {
                  label: 'Ancestry',
                  value: character.ancestry,
                },
              ]}
            ></LabelsList>
          </div>
        )
      })}
    </div>
  )
}
