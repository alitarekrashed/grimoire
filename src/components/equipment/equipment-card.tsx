'use client'

import { Equipment } from '@/models/equipment'
import Card from '../card/card'
import { EquipmentOptionalFields } from './equipment-optional-fields'
import { SavingThrowDisplay } from '../activation-displays/activation-description'

export default function EquipmentCard({
  value,
  collapsible,
  onRemoved,
}: {
  value: Equipment
  collapsible?: boolean
  onRemoved?: (item: Equipment) => void
}) {
  const attributes = (
    <div className="text-sm">
      <EquipmentOptionalFields value={value}></EquipmentOptionalFields>
    </div>
  )

  const additionalContent = value.saving_throw ? (
    <div className="mt-2">
      <SavingThrowDisplay value={value.saving_throw}></SavingThrowDisplay>
    </div>
  ) : (
    <></>
  )

  return (
    <Card
      data={value}
      type="Item"
      level={value.level}
      traits={value.traits}
      rarity={value.rarity}
      attributes={attributes}
      additionalContent={additionalContent}
      activation={value.activation}
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
