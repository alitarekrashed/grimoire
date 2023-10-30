import { useContext } from 'react'
import MoneyDisplay from '../money-display/money-display'
import { PlayerCharacterContext } from '../player-character-context'
import { EquipmentCategory } from '@/models/db/equipment'
import { CharacterEquipment } from '@/models/db/character-entity'
import { cloneDeep } from 'lodash'
import { PlayerCharacter } from '@/models/player-character'
import { Button } from '@/components/base/button'

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
      <div className="flex flex-col">
        {Array.from(groupedEquipment.entries()).map(
          (value: [EquipmentCategory, CharacterEquipment[]]) => (
            <div
              className="flex flex-col text-base font-extralight"
              key={value[0]}
            >
              {value[0]}
              {value[1].map((item) => (
                <span className="text-xs font-light" key={`${item.id}`}>
                  {item.name}
                  {value[0] === 'Armor' &&
                    item.id !==
                      playerCharacter.getCharacter().equipped_armor && (
                      <Button
                        onClick={() => {
                          updateEquippedArmor(item.id)
                        }}
                        label="EQUIP"
                        className="ml-2"
                      />
                    )}
                  {value[0] === 'Armor' &&
                    item.id ===
                      playerCharacter.getCharacter().equipped_armor && (
                      <Button
                        onClick={() => {
                          updateEquippedArmor('')
                        }}
                        label="REMOVE"
                        className="ml-2 border-rose-600"
                      />
                    )}
                </span>
              ))}
            </div>
          )
        )}
      </div>
    </>
  )
}
