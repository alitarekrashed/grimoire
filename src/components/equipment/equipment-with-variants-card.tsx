'use client'

import {
  Currency,
  Equipment,
  EquipmentVariantType,
  EquipmentWithVariants,
} from '@/models/equipment'
import * as Separator from '@radix-ui/react-separator'
import Card from '../card/card'
import CardLabel from '../card/card-label'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { ActivationLabel } from './activation-label'
import { PriceLabel } from './price-label'
import { EquipmentOptionalFields } from './equipment-optional-fields'

export default function EquipmentWithVariantsCard({
  value,
  collapsible,
  onRemoved,
}: {
  value: EquipmentWithVariants
  collapsible?: boolean
  onRemoved?: (item: EquipmentWithVariants) => void
}) {
  const attributes = (
    <div className="text-sm">
      <EquipmentOptionalFields value={value}></EquipmentOptionalFields>
      <ActivationLabel value={value.activation}></ActivationLabel>
    </div>
  )

  const additionalContent = (
    <EquipmentTypesList
      itemName={value.name}
      variants={value.types}
    ></EquipmentTypesList>
  )

  return (
    <Card
      data={value}
      type="Item"
      level={value.types.map((type) => type.level)}
      traits={value.traits}
      rarity={value.rarity}
      attributes={attributes}
      additionalContent={additionalContent}
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}

function EquipmentTypesList({
  itemName,
  variants,
}: {
  itemName: string
  variants: EquipmentVariantType[]
}) {
  return (
    <div>
      {variants.map((value) => (
        <div key={value.name}>
          <Separator.Root
            className="w-full bg-stone-400	h-px"
            style={{ margin: '10px 0' }}
          />
          <div className="inline-flex mb-1">
            <CardLabel
              label="Type"
              value={value.name}
              valueClassName="italic"
            ></CardLabel>
            ;&nbsp;
            <CardLabel label="Level" value={`${value.level}`}></CardLabel>
            ;&nbsp;
            <PriceLabel value={value.price}></PriceLabel>
          </div>
          <div className="text-xs">
            <ParsedDescription
              description={value.description}
            ></ParsedDescription>
          </div>
        </div>
      ))}
    </div>
  )
}
