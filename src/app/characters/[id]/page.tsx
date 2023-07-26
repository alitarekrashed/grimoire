'use client'

import { LabelsList } from '@/components/labels-list/labels-list'
import { Attribute } from '@/models/ancestry'
import { roboto_serif } from '@/utils/fonts'
import {
  PlayerCharacter,
  getCharacter,
} from '@/utils/services/character-service'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConditionRecordPage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  const [character, setCharacter] = useState<PlayerCharacter>()

  useEffect(() => {
    getCharacter(id).then((character: PlayerCharacter) => {
      setCharacter(character)
    })
  }, [])

  return (
    <div className={`h-full ${roboto_serif.className}`}>
      <h1>Character</h1>
      {character && <CharacterDisplay character={character}></CharacterDisplay>}
    </div>
  )
}

function CharacterDisplay({ character }: { character: PlayerCharacter }) {
  const attributes = character.getAttributes()
  console.log(character.getAncestryChoices())
  return (
    <div key={character.getCharacter()._id.toString()}>
      <LabelsList
        fieldDefinitions={[
          {
            label: 'Name',
            value: character.getCharacter().name,
          },
          {
            label: 'Level',
            value: character.getCharacter().level,
          },
        ]}
      ></LabelsList>
      <br />
      <LabelsList
        fieldDefinitions={[
          {
            label: 'Speed',
            value: character.getSpeed(),
          },
        ]}
      ></LabelsList>
      <br />
      {Object.keys(attributes).map((attribute) => (
        <>
          <span>{attribute}: </span>&nbsp;
          <span>{attributes[attribute as Attribute]}</span> <br />
        </>
      ))}
      <br />
      {character.getLanguages().map((language) => (
        <span key={language}>{language} </span>
      ))}
      <br />
      <br />
    </div>
  )
}
