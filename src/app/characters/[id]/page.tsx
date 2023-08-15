'use client'

import CalculatedDisplay from '@/components/calculated-display/calculated-display'
import { TraitsList } from '@/components/card/traits-list'
import CharacterBuilderModal from '@/components/character-builder/character-builder'
import { CharacterHeader } from '@/components/character-display/character-header'
import { FeaturesTabs } from '@/components/character-display/features-tabs'
import { LabelsList } from '@/components/labels-list/labels-list'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { ParsedDescription } from '@/components/parsed-description/parsed-description'
import { Attribute } from '@/models/db/ancestry'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { SavingThrowType } from '@/models/statistic'
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
    <div className={`h-full ${roboto_flex.className}`}>
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen">
          <LoadingSpinner loading={loading}></LoadingSpinner>
        </div>
      )}
      {character && (
        <>
          <CharacterHeader
            character={character}
            onBuilderClose={handleClose}
          ></CharacterHeader>
          <CharacterDisplay
            character={character}
            onSave={handleClose}
          ></CharacterDisplay>
        </>
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
            <div className="col-span-3 justify-self-center">
              <div className="border-2 border-stone-300 rounded-t-lg rounded-b-3xl p-2 h-full">
                <div className="inline-flex gap-5">
                  {Object.keys(character.getAttributes()).map((attribute) => (
                    <div
                      className="grid grid-cols-1 justify-items-center"
                      key={attribute}
                    >
                      <div className="font-medium">{attribute} </div>
                      <div>
                        {character.getAttributes()[attribute as Attribute] >
                          0 && `+`}
                        {character.getAttributes()[attribute as Attribute]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            <div className="col-span-1 justify-self-center">
              <div className="border-2 border-stone-300 p-2 rounded-t-lg rounded-b-3xl h-full pr-3 pl-3">
                <div className="grid grid-rows-2 grid-cols-2">
                  <span className="font-bold">Speed</span>
                  <CalculatedDisplay
                    values={character.getSpeed()}
                  ></CalculatedDisplay>
                  <span className="font-bold">Size</span>
                  <span>{character.getSize()}</span>
                </div>
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
            <div className="col-start-1 col-span-1">
              <div className="border-2 border-stone-300 p-2 rounded-t-lg rounded-b-3xl pr-3 pl-3">
                <div className="grid grid-rows-2">
                  <div className="row-span-1">
                    <div className="font-bold">Languages</div>
                    <span className="text-xs">
                      {languages.map((language, index) => (
                        <span key={`${language.feature.value}-${index}`}>{`${
                          language.feature.value
                        }${index < languages.length - 1 ? ', ' : ''}`}</span>
                      ))}
                    </span>
                  </div>
                  <div className="row-span-1">
                    <div className="font-bold">Senses</div>
                    <span className="text-xs">
                      {senses.map((sense, index) => {
                        return (
                          <React.Fragment key={`${sense}-${index}`}>
                            <ParsedDescription
                              description={sense.feature.value}
                            ></ParsedDescription>
                            {index < senses.length - 1 ? ', ' : ''}
                          </React.Fragment>
                        )
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex flex-col text-center">
              <div className="inline-flex gap-2">
                {[...character.getSavingThrows().entries()].map((entry) => (
                  <div key={entry[0]}>
                    <div className="font-semibold">{entry[0]}</div>
                    <span className="text-xs">{entry[1].rank}</span>
                    <div>
                      <span>
                        {(entry[1].modifier >= 0 ? ' +' : ' -') +
                          entry[1].modifier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">Saving throws</div>
            </div>
            <div className="text-center">
              <div className="inline-flex gap-2">
                <div>
                  <div className="font-semibold">Perception</div>
                  <span className="text-xs">
                    {character.getPerception().rank}
                  </span>
                  <div>
                    <span>
                      {(character.getPerception().modifier >= 0 ? ' +' : ' -') +
                        character.getPerception().modifier}
                    </span>
                  </div>
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
          <div className="inline-flex flex-col text-center">
            <div className="mb-4">Skills</div>
            <div className="flex flex-col gap-2">
              {[...character.getSkills().entries()].map((entry) => (
                <div className="inline-flex gap-2" key={entry[0]}>
                  <div className="font-semibold">{entry[0]}</div>
                  <span className="text-xs">{entry[1].rank}</span>
                  <div>
                    <span>
                      {(entry[1].modifier >= 0 ? ' +' : ' -') +
                        entry[1].modifier}
                    </span>
                  </div>
                </div>
              ))}
              {[...character.getLores().entries()].map((entry) => (
                <div className="inline-flex gap-2" key={entry[0]}>
                  <div className="font-semibold">Lore {entry[0]}</div>
                  <span className="text-xs">{entry[1].rank}</span>
                  <div>
                    <span>
                      {(entry[1].modifier >= 0 ? ' +' : ' -') +
                        entry[1].modifier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
