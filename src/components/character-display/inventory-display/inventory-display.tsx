import { useContext } from 'react'
import MoneyDisplay from '../money-display/money-display'
import { PlayerCharacterContext } from '../player-character-context'
import { EquipmentCategory } from '@/models/db/equipment'
import { CharacterEquipment } from '@/models/db/character-entity'
import { cloneDeep } from 'lodash'
import { PlayerCharacter } from '@/models/player-character'
import { Button } from '@/components/base/button'
import { Separator } from '@/components/base/separator'

export default function InventoryDisplay() {
  const { playerCharacter, updateAndSavePlayerCharacter } = useContext(
    PlayerCharacterContext
  )

  const groupedEquipment: Map<EquipmentCategory, CharacterEquipment[]> =
    playerCharacter
      .getCharacter()
      .equipment.reduce(
        (entryMap, e) =>
          entryMap.set(e.item.category, [
            ...(entryMap.get(e.item.category) || []),
            e,
          ]),
        new Map()
      )

  const updateEquippedArmor = (id: string) => {
    const updated = cloneDeep(playerCharacter.getCharacter())
    updated.equipped_armor = id
    PlayerCharacter.build(updated).then((val) =>
      updateAndSavePlayerCharacter(val)
    )
  }

  return (
    <>
      <MoneyDisplay></MoneyDisplay>
      <Separator className="mt-3 mb-1"></Separator>
      <div className="flex flex-col">
        {playerCharacter
          .getCharacter()
          .equipment.map((value: CharacterEquipment) => (
            <>
              <div className="flex flex-col" key={value.id}>
                <span className="text-xs font-semibold capitalize">
                  {value.name ?? value.item.name}
                </span>
                {value.name !== null && (
                  <span className="text-[10px] font-extralight italic">
                    {value.item.name}
                  </span>
                )}
                <span className="text-[10px] font-extralight">
                  {value.item.category}
                </span>
              </div>
              <Separator className="my-1"></Separator>
            </>
          ))}
      </div>
    </>
  )
}
