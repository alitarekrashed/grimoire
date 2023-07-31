'use client'

import { TraitsList } from '@/components/card/traits-list'
import { LabelsList } from '@/components/labels-list/labels-list'
import {
  ParsedDescription,
  ParsedToken,
} from '@/components/parsed-description/parsed-description'
import { Ancestry, Attribute } from '@/models/db/ancestry'
import {
  CharacterEntity,
  CharacterAncestry,
} from '@/models/db/character-entity'
import { Heritage } from '@/models/db/heritage'
import { PlayerCharacter } from '@/models/player-character'
import { useDebounce } from '@/utils/debounce'
import { roboto_serif } from '@/utils/fonts'
import { getPlayerCharacter } from '@/utils/services/player-character-service'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useEffect, useState } from 'react'

export default function CharacterPage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  const [character, setCharacter] = useState<PlayerCharacter>()

  useEffect(() => {
    getPlayerCharacter(id).then((character: PlayerCharacter) => {
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

  const handleAncestryChange = (ancestryId: string) => {
    character?.updateAncestry(ancestryId).then((val) => {
      setCharacter(val)
      debouncedRequest()
    })
  }

  const handleAncestryEdit = (ancestry: CharacterAncestry) => {
    let newCharacter: CharacterEntity = {
      ...character!.getCharacter(),
      ancestry: ancestry,
    }
    PlayerCharacter.build(newCharacter).then((val) => {
      setCharacter(val)
      debouncedRequest()
    })
  }

  const handleCharacterEdit = (char: CharacterEntity) => {
    PlayerCharacter.build(char).then((val) => {
      setCharacter(val)
      debouncedRequest()
    })
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
            onAncestryEdit={handleAncestryChange}
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
  const senses = character.getSenses()
  const additionalFeatures = character.getAdditionalFeatures()
  const resistances = character.getResistances()

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
              <span>{character.getAncestryName()}</span>
            </div>
          </div>
          <div className="border border-stone-300 p-2">
            <span>Hitpoints: </span>
            <span>{character.getMaxHitpoints()}</span>
          </div>
          <div>
            <TraitsList traits={character.getTraits()}></TraitsList>
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
          <div className="grid grid-rows-1 border border-stone-300 p-2">
            <span>Senses: </span>
            <span>
              {senses.map((sense, index) => {
                return (
                  <ParsedDescription
                    description={sense}
                    key={`${sense}-${index}`}
                  ></ParsedDescription>
                )
              })}
            </span>
          </div>
        </div>
        <br />
        <br />

        <div className="inline-flex gap-10 ">
          <div className="grid grid-rows-1 border border-stone-300 p-2">
            <span>Resistances: </span>
            <span>
              {resistances.map((resistance, index) => {
                return (
                  <LabelsList
                    key={`${resistance}-${index}`}
                    fieldDefinitions={[
                      {
                        label: resistance.damage_type,
                        value: resistance.value,
                      },
                    ]}
                  ></LabelsList>
                )
              })}
            </span>
          </div>

          <div className="grid grid-rows-1 border border-stone-300 p-2">
            <span>Additional features: </span>
            <span>
              {additionalFeatures.map((feature, index) => {
                return (
                  <ParsedDescription
                    description={feature}
                    key={`${feature}-${index}`}
                  ></ParsedDescription>
                )
              })}
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

// TODO separate out things like changing Ancestry with the choices from the Ancestry...
function CharacterEdit({
  character,
  onAncestryEdit,
  onEdit,
}: {
  character: PlayerCharacter
  onAncestryEdit: (ancestryId: string) => void
  onEdit: (val: CharacterAncestry) => void
}) {
  const [ancestries, setAncestries] = useState<Ancestry[]>([])
  const [heritages, setHeritages] = useState<Heritage[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/ancestries', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((ancestries) => {
        setAncestries(ancestries)
      })
  }, [])

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/heritages?ancestry=${character.getAncestryName()}`,
      {
        cache: 'no-store',
      }
    )
      .then((result) => result.json())
      .then((heritages) => {
        setHeritages(heritages)
      })
  }, [character.getCharacter().ancestry.id])

  const updateAncestry = (value: string) => {
    onAncestryEdit(value)
  }

  const updateAncestryAttributeMethod = () => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.free_attribute = !val.free_attribute
    onEdit(val)
  }

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

  const updateHeritage = (value: string) => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.heritage_id = value
    onEdit(val)
  }

  const languageChoices: (string | undefined)[] =
    character?.getCharacter().ancestry.language_selections

  return (
    <div className="inline-flex gap-5 border border-stone-300 p-2 items-center">
      <span>
        <h2>Ancestry</h2>
        <select
          className="bg-stone-800"
          value={character.getAncestryId().toString()}
          onChange={(e) => updateAncestry(e.target.value)}
        >
          {ancestries.map((ancestry) => (
            <option
              key={ancestry._id.toString()}
              value={ancestry._id.toString()}
            >
              {ancestry.name}
            </option>
          ))}
        </select>
      </span>
      <span>
        {character && (
          <label>
            <input
              className="bg-stone-800"
              type="checkbox"
              checked={character.getCharacter().ancestry.free_attribute}
              onChange={(e) => updateAncestryAttributeMethod()}
            />
            Freely assign attributes?
          </label>
        )}

        <h2>Attributes</h2>
        {character &&
          character
            .getCharacter()
            .ancestry.attribute_boost_selections.map(
              (choice: any, i: number) => {
                console.log(choice)
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-800 mr-2"
                      value={choice ?? ''}
                      onChange={(e) =>
                        updateAncestryAttribute(e.target.value as Attribute, i)
                      }
                    >
                      <option value={choice}>{choice}</option>
                      {character
                        .getAttributeChoices()
                        .ancestry.map((attribute) => (
                          <option key={attribute} value={attribute}>
                            {attribute}
                          </option>
                        ))}
                    </select>
                  </React.Fragment>
                )
              }
            )}
      </span>
      {languageChoices.length > 0 && (
        <span>
          <h2>Languages</h2>
          {character &&
            languageChoices.map((choice: any, i: number) => (
              <React.Fragment key={i}>
                <select
                  className="bg-stone-800 mr-2"
                  value={choice ?? ''}
                  onChange={(e) => updateAncestryLanguage(e.target.value, i)}
                >
                  <option value={choice}>{choice}</option>
                  {character.getLanguageChoices().ancestry.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </React.Fragment>
            ))}
        </span>
      )}
      <span>
        <h2>Heritage</h2>
        <select
          className="bg-stone-800"
          value={character.getCharacter().ancestry.heritage_id}
          onChange={(e) => updateHeritage(e.target.value)}
        >
          {heritages.map((heritage) => (
            <option
              key={heritage._id.toString()}
              value={heritage._id.toString()}
            >
              {heritage.name}
            </option>
          ))}
        </select>
      </span>
    </div>
  )
}
