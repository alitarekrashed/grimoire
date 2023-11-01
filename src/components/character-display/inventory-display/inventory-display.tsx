import { Separator } from '@/components/base/separator'
import { TraitsList } from '@/components/card/traits-list'
import { CharacterEquipment } from '@/models/db/character-entity'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import MoneyDisplay from './money-display/money-display'
import BulkDisplay from './bulk-display'
import { Button } from '@/components/base/button'

export default function InventoryDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  return (
    <>
      <div className="flex flex-row w-full items-center">
        <div className="flex-1 flex flex-row items-center gap-2">
          <Button label="+ Add item" className="h-fit text-sm"></Button>
        </div>
        <div className="flex flex-row gap-2">
          <BulkDisplay></BulkDisplay>
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
