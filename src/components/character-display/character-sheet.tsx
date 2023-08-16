import { PlayerCharacter } from '@/models/player-character'
import { useDebounce } from '@/utils/debounce'
import { roboto_flex } from '@/utils/fonts'
import { getPlayerCharacter } from '@/utils/services/player-character-service'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { CharacterHeader } from './character-header'
import { CharacterSheetBox } from './character-sheet-box'
import { Defenses } from './defenses'
import { FeaturesTabs } from './features-tabs'
import { ProficiencyModifiersColumn } from './proficiency-modifiers-column'
import { Attacks } from './attacks'

export function CharacterSheet({ id }: { id: string }) {
  const [character, setCharacter] = useState<PlayerCharacter>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getPlayerCharacter(id).then((character: PlayerCharacter) => {
      setCharacter(character)
      setLoading(false)
    })
  }, [id])

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
        <div className="fixed top-0 left-0 h-full w-full">
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
                <Attacks character={character}></Attacks>
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
