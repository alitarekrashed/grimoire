import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'

export default function BulkDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const encumberanceLimit =
    Math.max(0, playerCharacter.getAttributes().Strength) + 5
  const maxBulk = Math.max(0, playerCharacter.getAttributes().Strength) + 10
  const totalLightItems = playerCharacter
    .getCharacter()
    .equipment.filter((value) => value.item.bulk === 'L').length
  const calculatedBulk =
    playerCharacter
      .getCharacter()
      .equipment.filter((value) => value.item.bulk && value.item.bulk !== 'L')
      .map((value) => Number(value.item.bulk))
      .reduce((sum, value) => sum + value, 0) + Math.floor(totalLightItems / 10)

  return (
    <div className="flex flex-col w-fit items-start text-xs py-1 px-1 border border-stone-500 rounded">
      <div className="flex flex-row text-sm justify-center w-full">
        <span className="mr-2">Bulk</span>
        <span>{calculatedBulk}</span>
      </div>
      <div className="flex flex-row font-extralight w-full text-[10px]">
        <span className="font-light flex-1 pr-2">Encumbered</span>
        <span>{encumberanceLimit}+</span>
      </div>
      <div className="flex flex-row font-extralight w-full text-[10px]">
        <span className="font-light flex-1 pr-2">Max</span>
        <span>{maxBulk}+</span>
      </div>
    </div>
  )
}
