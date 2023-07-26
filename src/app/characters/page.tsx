'use client'

import { LabelsList } from '@/components/labels-list/labels-list'
import { Ancestry } from '@/models/ancestry'
import { Character } from '@/models/character'
import { roboto_serif } from '@/utils/fonts'
import { getCharacters } from '@/utils/services/character-service'
import { useEffect, useState } from 'react'

export default function CharactersPage() {
  const [characters, setCharacters] = useState<
    { character: Character; ancestry: Ancestry }[]
  >([])

  useEffect(() => {
    getCharacters().then(
      (characters: { character: Character; ancestry: Ancestry }[]) => {
        console.log(characters)
        setCharacters(characters)
      }
    )
  }, [])

  return (
    <div className={`h-full ${roboto_serif.className}`}>
      <h1>Character</h1>
      {characters.map((result) => {
        return (
          <div key={result.character._id.toString()}>
            <LabelsList
              fieldDefinitions={[
                {
                  label: 'Name',
                  value: result.character.name,
                },
                {
                  label: 'Level',
                  value: result.character.level,
                },
              ]}
            ></LabelsList>
            <br />
            <LabelsList
              fieldDefinitions={[
                {
                  label: 'Ancestry name',
                  value: result.ancestry.name,
                },
                {
                  label: 'Speed',
                  value: result.ancestry.speed,
                },
                {
                  label: 'Size',
                  value: result.ancestry.size,
                },
              ]}
            ></LabelsList>
          </div>
        )
      })}
    </div>
  )
}
