'use client'

import { LabelsList } from '@/components/labels-list/labels-list'
import { Ancestry, Attribute } from '@/models/ancestry'
import { Character } from '@/models/character'
import { roboto_serif } from '@/utils/fonts'
import {
  PlayerCharacter,
  getCharacters,
} from '@/utils/services/character-service'
import { useEffect, useState } from 'react'

export default function CharactersPage() {
  const [characters, setCharacters] = useState<PlayerCharacter[]>([])

  useEffect(() => {
    getCharacters().then((characters: PlayerCharacter[]) => {
      console.log(characters)
      setCharacters(characters)
    })
  }, [])

  return (
    <div className={`h-full ${roboto_serif.className}`}>
      <h1>Character</h1>
      {characters.map((result) => {
        const attributes = result.getAttributes()
        console.log(result.getAncestryChoices())
        return (
          <div key={result.getCharacter()._id.toString()}>
            <LabelsList
              fieldDefinitions={[
                {
                  label: 'Name',
                  value: result.getCharacter().name,
                },
                {
                  label: 'Level',
                  value: result.getCharacter().level,
                },
              ]}
            ></LabelsList>
            <br />
            <LabelsList
              fieldDefinitions={[
                {
                  label: 'Speed',
                  value: result.getSpeed(),
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
            {result.getLanguages().map((language) => (
              <span key={language}>{language} </span>
            ))}
            <br />
            <br />
          </div>
        )
      })}
    </div>
  )
}
