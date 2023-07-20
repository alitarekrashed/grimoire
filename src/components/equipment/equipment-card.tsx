'use client'

import { Equipment } from '@/models/equipment'
import Card from '../card/card'
import { ActivationLabel } from './activation-label'
import { EquipmentOptionalFields } from './equipment-optional-fields'
import { PriceLabel } from './price-label'

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
      <PriceLabel value={value.price}></PriceLabel>
      <EquipmentOptionalFields value={value}></EquipmentOptionalFields>
    </div>
  )

  return (
    <Card
      data={value}
      type="Item"
      level={value.level}
      traits={value.traits}
      rarity={value.rarity}
      attributes={attributes}
      activation={value.activation}
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
