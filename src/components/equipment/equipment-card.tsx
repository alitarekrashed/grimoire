'use client'

import { Currency, Equipment, EquipmentVariantType } from '@/models/equipment'
import * as Separator from '@radix-ui/react-separator'
import { useState } from 'react'
import Activation from '../card/activation-display'
import Card from '../card/card'
import CardLabel from '../card/card-label'
import { ParsedDescription } from '../parsed-description/parsed-description'

export default function EquipmentCard({ value }: { value: Equipment }) {
  const [fadeIn, setFadeIn] = useState(false)

  const attributes = (
    <div className="text-sm">
      <PriceLabel value={value.price}></PriceLabel>
      <OptionalFields value={value}></OptionalFields>
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
      attributes={attributes}
      additionalContent={additionalContent}
    ></Card>
  )
}

// TODO better type
function ActivationLabel({ value }: { value: any }) {
  return value ? (
    <div className="flex">
      Activate:&nbsp;<Activation value={value}></Activation>
    </div>
  ) : (
    <></>
  )
}

function PriceLabel({ value }: { value: Currency[] | undefined }) {
  let monetaryValue = ''
  if (value) {
    value.forEach((element, index) => {
      if (index > 0) {
        monetaryValue = monetaryValue.concat(', ')
      }
      monetaryValue = monetaryValue.concat(`${element.value} ${element.type}`)
    })
  }

  return value ? (
    <div>
      <CardLabel label="Price" value={monetaryValue}></CardLabel>
    </div>
  ) : (
    <></>
  )
}

// TODO add equipment id to key here?
function OptionalFields({ value }: { value: Equipment }) {
  let optionalFields = []
  if (value.hands) {
    optionalFields.length > 0 && optionalFields.push('; ')
    optionalFields.push(
      <CardLabel key="Hands" label="Hands" value={value.hands}></CardLabel>
    )
  }
  if (value.usage) {
    optionalFields.length > 0 && optionalFields.push('; ')
    optionalFields.push(
      <CardLabel key="Usage" label="Usage" value={value.usage}></CardLabel>
    )
  }
  if (value.bulk) {
    optionalFields.length > 0 && optionalFields.push('; ')
    optionalFields.push(
      <CardLabel key="Bulk" label="Bulk" value={value.bulk}></CardLabel>
    )
  }

  return optionalFields
}

function EquipmentTypesList({
  itemName,
  variants,
}: {
  itemName: string
  variants: EquipmentVariantType[] | undefined
}) {
  return variants ? (
    <div>
      {variants.map((value) => (
        <div key={value.name}>
          <Separator.Root
            className="w-full bg-slate-400	h-px"
            style={{ margin: '10px 0' }}
          />
          <div className="inline-flex mb-1">
            <CardLabel
              label="Type"
              value={
                value.name
                  ? `${itemName.toLowerCase()}, ${value.name}`
                  : `${itemName.toLowerCase()}`
              }
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
  ) : (
    <></>
  )
}
