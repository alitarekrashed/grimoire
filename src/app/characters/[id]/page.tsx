'use client'

import CalculatedDisplay from '@/components/calculated-display/calculated-display'
import { CharacterHeader } from '@/components/character-display/character-header'
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
          <div className="w-fit">
            <ProficiencyModifiersColumn
              character={character}
            ></ProficiencyModifiersColumn>
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
            <div className="col-span-1 justify-self-center">
              <div className="border-2 border-stone-300 p-2 rounded-t-lg rounded-b-3xl h-full pr-3 pl-3 w-fit text-center">
                <div>
                  <CalculatedDisplay
                    values={character.getMaxHitpoints()}
                  ></CalculatedDisplay>
                </div>
                <div className="text-[10px] font-semibold">Hitpoints</div>
              </div>
            </div>
            <div className="col-span-3 justify-self-start">
              <div className="border-2 border-stone-300 p-2 rounded-t-lg rounded-b-3xl h-full pr-3 pl-3">
                <div className="grid grid-rows-2 grid-cols-3 gap-1">
                  <span className="font-bold col-span-1">Resistances</span>
                  <span className="col-span-3">
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
              </div>
            </div>
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
