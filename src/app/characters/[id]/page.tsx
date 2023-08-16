'use client'

import CalculatedDisplay from '@/components/calculated-display/calculated-display'
import { CharacterHeader } from '@/components/character-display/character-header'
import { CharacterSheetBox } from '@/components/character-display/character-sheet-box'
import { FeaturesTabs } from '@/components/character-display/features-tabs'
import { ProficiencyModifiersColumn } from '@/components/character-display/proficiency-modifiers-column'
import { LabelsList } from '@/components/labels-list/labels-list'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { ParsedDescription } from '@/components/parsed-description/parsed-description'
import { Attribute } from '@/models/db/ancestry'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { useDebounce } from '@/utils/debounce'
import { roboto_condensed, roboto_flex } from '@/utils/fonts'
import { getPlayerCharacter } from '@/utils/services/player-character-service'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function CharacterPage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  const [character, setCharacter] = useState<PlayerCharacter>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getPlayerCharacter(id).then((character: PlayerCharacter) => {
      setCharacter(character)
      setLoading(false)
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

  const handleClose = (char: CharacterEntity) => {
    setLoading(true)
    PlayerCharacter.build(char).then((val) => {
      setCharacter(val)
      setLoading(false)
      debouncedRequest()
    })
  }

  return (
    <div className={`h-screen overflow-y-scroll ${roboto_flex.className}`}>
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen">
          <LoadingSpinner loading={loading}></LoadingSpinner>
        </div>
      )}
      {character && (
        <div className="bg-stone-900">
          <CharacterHeader
            character={character}
            onBuilderClose={handleClose}
          ></CharacterHeader>
          <div className="flex p-2">
            <div className="w-fit h-fit mr-2">
              <ProficiencyModifiersColumn
                character={character}
              ></ProficiencyModifiersColumn>
            </div>
            <div className="w-1/3">
              <CharacterSheetBox>
                <div className="flex flex-col gap-1 text-left h-fit">
                  <div className="mb-1 text-base font-semibold">Defenses</div>
                  <div className="flex flex-row gap-5 h-full">
                    <div className="ml-5 w-fit min-h-full text-center rounded-md border border-b-stone-300 bg-stone-700 p-2">
                      <div>
                        <span>
                          {character
                            .getMaxHitpoints()
                            .reduce((sum, value) => sum + value.value, 0)}
                        </span>
                        <span className="mx-1">/</span>
                        <CalculatedDisplay
                          values={character.getMaxHitpoints()}
                        ></CalculatedDisplay>
                      </div>
                      <div className="text-sm font-medium">Hitpoints</div>
                    </div>
                    <div className="grid grid-cols-1 items-center rounded-md border border-b-stone-300 bg-stone-700 p-2 min-h-full">
                      <div className="flex">
                        <div className="pr-2 mr-auto font-medium">
                          Resistances
                        </div>
                        <div>
                          {character
                            .getResistances()
                            .map((resistance, index) => {
                              return (
                                <LabelsList
                                  key={`${resistance}-${index}`}
                                  fieldDefinitions={[
                                    {
                                      label:
                                        resistance.feature.value.damage_type,
                                      value: resistance.feature.value.value,
                                    },
                                  ]}
                                ></LabelsList>
                              )
                            })}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="pr-2 mr-auto font-medium">
                          Vulnerabilities
                        </div>
                        <div>
                          {character
                            .getResistances()
                            .map((resistance, index) => {
                              return (
                                <LabelsList
                                  key={`${resistance}-${index}`}
                                  fieldDefinitions={[
                                    {
                                      label:
                                        resistance.feature.value.damage_type,
                                      value: resistance.feature.value.value,
                                    },
                                  ]}
                                ></LabelsList>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CharacterSheetBox>
            </div>
          </div>
          <CharacterDisplay
            character={character}
            onSave={handleClose}
          ></CharacterDisplay>
        </div>
      )}
    </div>
  )
}

function CharacterDisplay({
  character,
  onSave,
}: {
  character: PlayerCharacter
  onSave: (character: CharacterEntity) => void
}) {
  const languages = character.getLanguages()
  const senses = character.getSenses()
  const additionalFeatures = character.getAdditionalFeatures()
  const resistances = character.getResistances()
  const actions = character.getActions()
  const proficiencies = character.getProficiencies()

  return (
    <>
      <div className={`text-sm p-2 ${roboto_condensed.className}`}>
        <div className="mb-[700px]"></div>
        <div className="ml-2">
          <div className="grid grid-cols-9 gap-6">
            <div className="col-start-5 col-span-4">
              <div className="border-2 border-stone-300 rounded-t-lg rounded-b-3xl p-2 h-full">
                <FeaturesTabs
                  features={additionalFeatures}
                  actions={actions}
                  proficiencies={proficiencies}
                ></FeaturesTabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
