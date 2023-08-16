'use client'

import CalculatedDisplay from '@/components/calculated-display/calculated-display'
import { CharacterHeader } from '@/components/character-display/character-header'
import { CharacterSheetBox } from '@/components/character-display/character-sheet-box'
import { Defenses } from '@/components/character-display/defenses'
import { FeaturesTabs } from '@/components/character-display/features-tabs'
import { ProficiencyModifiersColumn } from '@/components/character-display/proficiency-modifiers-column'
import { LabelsList } from '@/components/labels-list/labels-list'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { useDebounce } from '@/utils/debounce'
import { roboto_flex } from '@/utils/fonts'
import { getPlayerCharacter } from '@/utils/services/player-character-service'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
          <div className="grid grid-rows-4 grid-cols-10 p-2 gap-1">
            <div className="col-span-1 row-span-full">
              <ProficiencyModifiersColumn
                character={character}
              ></ProficiencyModifiersColumn>
            </div>
            <div className="col-span-3 row-span-full grid grid-rows-4 gap-1">
              <div className="row-span-1">
                <Defenses character={character}></Defenses>
              </div>
              <div className="row-span-3">
                <CharacterSheetBox>
                  <div>
                    <div className="flex flex-col gap-1 h-fit">
                      <div className="mb-1 text-base font-semibold">
                        Attacks
                      </div>
                    </div>
                  </div>
                </CharacterSheetBox>
              </div>
            </div>
            <div className="col-span-6 row-span-full">
              <CharacterSheetBox>
                <FeaturesTabs
                  features={character.getAdditionalFeatures()}
                  actions={character.getActions()}
                  proficiencies={character.getProficiencies()}
                ></FeaturesTabs>
              </CharacterSheetBox>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
