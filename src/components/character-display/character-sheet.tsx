import { PlayerCharacter } from '@/models/player-character'
import { useDebounce } from '@/utils/debounce'
import { roboto_flex } from '@/utils/fonts'
import { getPlayerCharacter } from '@/utils/services/player-character-service'
import { useContext, useEffect, useState } from 'react'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { CharacterHeader } from './character-header'
import { CharacterSheetBox } from './character-sheet-box'
import { Defenses } from './defenses'
import { FeaturesTabs } from './features-tabs'
import { ProficiencyModifiersColumn } from './proficiency-modifiers-column'
import { Attacks } from './attacks'
import { PlayerCharacterContext } from './player-character-context'

export function CharacterSheet({ id }: { id: string }) {
  const [loading, setLoading] = useState<boolean>(false)

  const { playerCharacter, updatePlayerCharacter } = useContext(
    PlayerCharacterContext
  )

  useEffect(() => {
    setLoading(true)
    getPlayerCharacter(id).then((character: PlayerCharacter) => {
      updatePlayerCharacter(character)
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
          body: JSON.stringify(playerCharacter!.getCharacter()),
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
      updatePlayerCharacter(val)
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
      {playerCharacter && (
        <div className="bg-stone-900 h-full">
          <CharacterHeader onBuilderClose={handleClose}></CharacterHeader>
          <div className="grid grid-rows-4 grid-cols-10 p-2 gap-1 h-[90%]">
            <div className="col-span-1 row-span-full h-full">
              <ProficiencyModifiersColumn></ProficiencyModifiersColumn>
            </div>
            <div className="col-span-4 row-span-full grid grid-rows-4 gap-1">
              <div className="row-span-1">
                <Defenses></Defenses>
              </div>
              <div className="row-span-3">
                <Attacks></Attacks>
              </div>
            </div>
            <div className="col-span-5 row-span-full h-full">
              <CharacterSheetBox>
                <FeaturesTabs></FeaturesTabs>
              </CharacterSheetBox>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
