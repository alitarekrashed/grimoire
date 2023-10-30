import { Separator } from '@/components/base/separator'
import { TraitsList } from '@/components/card/traits-list'
import { CharacterEquipment } from '@/models/db/character-entity'
import { EquipmentCategory } from '@/models/db/equipment'
import { useContext } from 'react'
import MoneyDisplay from '../money-display/money-display'
import { PlayerCharacterContext } from '../player-character-context'

export default function InventoryDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const totalBulk = Math.max(0, playerCharacter.getAttributes().Strength) + 5
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
    <>
      <div className="flex flex-row w-full items-center">
        <div className="flex-1">
          <div className="flex flex-col w-fit items-center text-sm py-1 px-6 border border-stone-500 rounded">
            <span className="text-xs">
              {calculatedBulk} / {totalBulk}
            </span>
            <span className="font-light">Bulk</span>
          </div>
        </div>
        <div className="">
          <MoneyDisplay></MoneyDisplay>
        </div>
      </div>
      <div className="grid grid-rows-1 grid-cols-12 text-xs font-bold mt-2">
        <span className="col-span-4">Name</span>
        <span>Category</span>
        <span>Bulk</span>
        <span>Hands</span>
      </div>
      <Separator className="my-1"></Separator>
      <div className="flex flex-col">
        {playerCharacter
          .getCharacter()
          .equipment.map((value: CharacterEquipment) => (
            <>
              <div
                className="grid grid-rows-1 grid-cols-12 text-xs font-extralight"
                key={value.id}
              >
                <div className="font-semibold capitalize col-span-4">
                  <div className="flex flex-col">
                    {value.name ?? value.item.name}
                    {value.name !== null && (
                      <span className="text-[10px] font-extralight italic lowercase">
                        {value.item.name}
                      </span>
                    )}
                    <div>
                      <TraitsList
                        className="text-[10px] font-normal lowercase"
                        traits={value.item.traits ?? []}
                      ></TraitsList>
                    </div>
                  </div>
                </div>
                <span>{value.item.category}</span>
                <span>{value.item.bulk}</span>
                <span>{value.item.hands}</span>
                <div></div>
              </div>
              <Separator className="my-1"></Separator>
            </>
          ))}
      </div>
    </>
  )
}
