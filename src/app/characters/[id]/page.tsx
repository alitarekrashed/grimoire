'use client'

import { LabelsList } from '@/components/labels-list/labels-list'
import { Attribute } from '@/models/ancestry'
import { CharacterEntity, CharacterAncestry } from '@/models/character-entity'
import { useDebounce } from '@/utils/debounce'
import { roboto_serif } from '@/utils/fonts'
import {
  PlayerCharacter,
  getCharacter,
} from '@/utils/services/character-service'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useEffect, useState } from 'react'

export default function CharacterPage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  const [character, setCharacter] = useState<PlayerCharacter>()

  useEffect(() => {
    getCharacter(id).then((character: PlayerCharacter) => {
      setCharacter(character)
    })
  }, [])

  const debouncedRequest = useDebounce(() => {
    const saveEntity = async () => {
      try {
        await fetch(`http://localhost:3000/api/characters/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(character!.getCharacter()),
        })
      } catch (error) {
        console.log(error)
      }
    }

    saveEntity()
  })

  const handleAncestryEdit = (ancestry: CharacterAncestry) => {
    let newCharacter: CharacterEntity = {
      ...character!.getCharacter(),
      ancestry: ancestry,
    }
    setCharacter(character?.updateCharacter(newCharacter))
    debouncedRequest()
  }

  const handleCharacterEdit = (char: CharacterEntity) => {
    setCharacter(character?.updateCharacter(char))
    debouncedRequest()
  }

  return (
    <div className={`h-full ${roboto_serif.className}`}>
      {character && (
        <>
          <CharacterDisplay
            character={character}
            onEdit={handleCharacterEdit}
          ></CharacterDisplay>
          <CharacterEdit
            character={character}
            onEdit={handleAncestryEdit}
          ></CharacterEdit>
        </>
      )}
    </div>
  )
}

function CharacterDisplay({
  character,
  onEdit,
}: {
  character: PlayerCharacter
  onEdit: (character: CharacterEntity) => void
}) {
  const updateName = (value: string) => {
    let val: CharacterEntity = { ...character.getCharacter() }
    val.name = value
    onEdit(val)
  }

  return (
    character && (
      <div>
        <div>
          <span>Name: </span>
          <input
            className="bg-stone-800"
            value={character.getCharacter().name}
            onChange={(e) => {
              updateName(e.target.value)
            }}
          ></input>
        </div>
        <div>
          <span>Level: </span>
          <span>{character.getCharacter().level}</span>
        </div>

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
        {Object.keys(character.getAttributes()).map((attribute) => (
          <React.Fragment key={attribute}>
            <span>{attribute}: </span>&nbsp;
            <span>{character.getAttributes()[attribute as Attribute]}</span>
            <br />
          </React.Fragment>
        ))}
        <br />
        {character.getLanguages().map((language, index) => (
          <span key={`${language}-${index}`}>{language}</span>
        ))}
        <br />
        <br />
      </div>
    )
  )
}

function CharacterEdit({
  character,
  onEdit,
}: {
  character: PlayerCharacter
  onEdit: (val: any) => void
}) {
  const updateAncestryAttribute = (value: Attribute, index: number) => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.attribute_boost_selections[index] = value
    onEdit(val)
  }

  const updateAncestryLanguage = (value: string, index: number) => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.language_selections[index] = value
    onEdit(val)
  }

  return (
    <div>
      <h1>Ancestry</h1>
      <h2>Attributes</h2>
      <span>
        {character &&
          character
            .getCharacter()
            .ancestry.attribute_boost_selections.map(
              (choice: any, i: number) => (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-800"
                    value={choice}
                    onChange={(e) =>
                      updateAncestryAttribute(e.target.value as Attribute, i)
                    }
                  >
                    <option value=""></option>
                    {Object.keys(character.getAttributes()).map(
                      (attribute) =>
                        character
                          .getAncestry()
                          .attribute_boosts.filter((val) => val === attribute)
                          .length == 0 && (
                          <option key={attribute} value={attribute}>
                            {attribute}
                          </option>
                        )
                    )}
                  </select>
                </React.Fragment>
              )
            )}
      </span>
      <h2>Languages</h2>
      <span>
        {character &&
          character
            .getCharacter()
            .ancestry.language_selections.map((choice: any, i: number) => (
              <React.Fragment key={i}>
                <select
                  className="bg-stone-800"
                  value={choice}
                  onChange={(e) => updateAncestryLanguage(e.target.value, i)}
                >
                  <option value=""></option>

                  {character.getAncestry().languages.options.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </React.Fragment>
            ))}
      </span>
    </div>
  )
}
