import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import CalculatedDisplay, {
  ModifierValue,
} from '@/components/calculated-display/calculated-display'
import { max } from 'lodash'

export default function BulkDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const bulkModifiers = playerCharacter
    .getResolvedFeatures()
    .filter(
      (sourced) =>
        sourced.feature.type === 'MODIFIER' &&
        sourced.feature.value.type === 'Bulk'
    )
    .map((sourced) => {
      return {
        source: sourced.source,
        value: sourced.feature.value.modifier.value,
      }
    })

  const encumberance: ModifierValue[] = [
    {
      value: 5,
      source: 'Encumberance',
    },
    {
      value: Math.max(0, playerCharacter.getAttributes().Strength),
      source: 'Strength',
    },
    ...bulkModifiers,
  ]

  const maximum: ModifierValue[] = [
    {
      value: 10,
      source: 'Maximum',
    },
    {
      value: Math.max(0, playerCharacter.getAttributes().Strength),
      source: 'Strength',
    },
    ...bulkModifiers,
  ]

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
        <span>
          <CalculatedDisplay values={encumberance}></CalculatedDisplay>+
        </span>
      </div>
      <div className="flex flex-row font-extralight w-full text-[10px]">
        <span className="font-light flex-1 pr-2">Max</span>
        <span>
          <CalculatedDisplay values={maximum}></CalculatedDisplay>+
        </span>
      </div>
    </div>
  )
}
