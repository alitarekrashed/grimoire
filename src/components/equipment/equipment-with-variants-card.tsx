'use client'

import { EquipmentVariantType, EquipmentWithVariants } from '@/models/equipment'
import { getPriceValue } from '@/utils/services/currency-utils'
import * as Separator from '@radix-ui/react-separator'
import Card from '../card/card'
import { LabelsList } from '../labels-list/labels-list'
import { ParsedDescription } from '../parsed-description/parsed-description'
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
      activation={value.activation}
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
  let content = variants.map((value) => {
    const fields = [
      {
        label: 'Type',
        value: value.name,
      },
      {
        label: 'Level',
        value: value.level,
      },
      {
        label: 'Price',
        value: getPriceValue(value.price),
      },
    ]
    return (
      <div key={value.name}>
        <Separator.Root
          className="w-full bg-stone-400	h-px"
          style={{ margin: '10px 0' }}
        />
        <div className="mb-1">
          <LabelsList fieldDefinitions={fields}></LabelsList>
        </div>
        <div className="text-xs">
          <ParsedDescription
            description={value.description}
          ></ParsedDescription>
        </div>
      </div>
    )
  })

  return <div>{content}</div>
}
