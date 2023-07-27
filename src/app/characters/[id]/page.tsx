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

  const languages = character.getLanguages().filter((language) => language)

  return (
    character && (
      <div>
        <div className="inline-flex gap-5 mb-2 items-center">
          <div className="inline-flex gap-5 border border-stone-300 p-2">
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
            <div>
              <span>Ancestry: </span>
              <span>{character.getAncestry().name}</span>
            </div>
          </div>
          <div className="border border-stone-300 p-2">
            <span>Hitpoints: </span>
            <span>{character.getMaxHitpoints()}</span>
          </div>
        </div>
        <br />
        <div className="inline-flex gap-10 ">
          <div className="inline-flex gap-5 border border-stone-300 p-2">
            {Object.keys(character.getAttributes()).map((attribute) => (
              <div
                className="grid grid-cols-1 justify-items-center"
                key={attribute}
              >
                <div>{attribute} </div>
                <div>
                  {character.getAttributes()[attribute as Attribute] > 0 && `+`}
                  {character.getAttributes()[attribute as Attribute]}
                </div>
                &nbsp;
              </div>
            ))}
          </div>
          <div className="inline-flex border border-stone-300 p-2 items-center">
            <LabelsList
              fieldDefinitions={[
                {
                  label: 'Speed',
                  value: character.getSpeed(),
                },
              ]}
            ></LabelsList>
          </div>
          <div className="inline-flex border border-stone-300 p-2 items-center">
            <LabelsList
              fieldDefinitions={[
                {
                  label: 'Size',
                  value: character.getSize(),
                },
              ]}
            ></LabelsList>
          </div>
          <div className="grid grid-rows-1 border border-stone-300 p-2">
            <span>Languages: </span>
            <span>
              {languages.map((language, index) => (
                <span key={`${language}-${index}`}>{`${language}${
                  index < languages.length - 1 ? ', ' : ''
                }`}</span>
              ))}
            </span>
          </div>
        </div>
        <br />
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

  const languageChoices: (string | undefined)[] =
    character?.getCharacter().ancestry.language_selections

  return (
    <div className="inline-flex gap-5 border border-stone-300 p-2 items-center">
      <h1>Ancestry choices</h1>
      <span>
        <h2>Attributes</h2>
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
      {languageChoices.length > 0 && (
        <span>
          <h2>Languages</h2>
          {character &&
            languageChoices.map((choice: any, i: number) => (
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
      )}
    </div>
  )
}
