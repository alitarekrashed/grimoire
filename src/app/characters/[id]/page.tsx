'use client'

import { TraitsList } from '@/components/card/traits-list'
import CharacterBuilderModal from '@/components/character-builder/character-builder'
import { LabelsList } from '@/components/labels-list/labels-list'
import { ParsedDescription } from '@/components/parsed-description/parsed-description'
import { Attribute } from '@/models/db/ancestry'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { useDebounce } from '@/utils/debounce'
import { roboto_serif } from '@/utils/fonts'
import { getPlayerCharacter } from '@/utils/services/player-character-service'
import { usePathname } from 'next/navigation'
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

  const handleCharacterEdit = (char: CharacterEntity) => {
    PlayerCharacter.build(char).then((val) => {
      setCharacter(val)
      debouncedRequest()
    })
  }

  const handleClose = (char: CharacterEntity) => {
    PlayerCharacter.build(char).then((val) => {
      setCharacter(val)
      debouncedRequest()
    })
  }

  return (
    <div className={`h-full ${roboto_serif.className}`}>
      {character && (
        <>
          <CharacterDisplay character={character}></CharacterDisplay>
          <CharacterBuilderModal
            playerCharacter={character}
            onClose={handleClose}
          ></CharacterBuilderModal>
        </>
      )}
    </div>
  )
}

function CharacterDisplay({ character }: { character: PlayerCharacter }) {
  const languages = character.getLanguages()
  const senses = character.getSenses()
  const additionalFeatures = character.getAdditionalFeatures()
  const resistances = character.getResistances()
  const actions = character.getActions()
  const proficiencies = character.getProficiencies()

  return (
    character && (
      <div>
        <div className="inline-flex gap-5 mb-2 items-center">
          <div className="inline-flex gap-5 border border-stone-300 p-2">
            <div>
              <span>Name: </span>
              <span>{character.getCharacter().name}</span>
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
                <span key={`${language.feature.value}-${index}`}>{`${
                  language.feature.value
                }${index < languages.length - 1 ? ', ' : ''}`}</span>
              ))}
            </span>
          </div>
          <div className="grid grid-rows-1 border border-stone-300 p-2">
            <span>Senses: </span>
            <span>
              {senses.map((sense, index) => {
                return (
                  <ParsedDescription
                    description={sense.feature.value}
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
                        label: resistance.feature.value.damage_type,
                        value: resistance.feature.value.value,
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
                    description={feature.feature.value}
                    key={`${feature.feature.value}-${index}`}
                  ></ParsedDescription>
                )
              })}
            </span>
          </div>

          <div className="grid grid-rows-1 border border-stone-300 p-2">
            <span>Actions: </span>
            <span>
              {actions.map((action, index) => {
                return (
                  <ParsedDescription
                    description={action.feature.value}
                    key={`${action}-${index}`}
                  ></ParsedDescription>
                )
              })}
            </span>
          </div>

          <div className="grid grid-rows-1 border border-stone-300 p-2">
            <span>Proficiencies: </span>
            <span>
              {proficiencies.map((proficiency, index) => {
                return (
                  <div key={`${proficiency.feature.value.value}-${index}`}>
                    <LabelsList
                      fieldDefinitions={[
                        {
                          label:
                            proficiency.feature.value.type === 'Lore'
                              ? `Lore ${proficiency.feature.value.value}`
                              : proficiency.feature.value.value,
                          value: proficiency.feature.value.rank,
                        },
                      ]}
                    ></LabelsList>
                  </div>
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
