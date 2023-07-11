'use client'

import { Currency, Equipment, EquipmentVariantType } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'
import CardLabel from './card-label'
import CardHeader from './card-header'
import Traits from './traits-display'
import Activation from './activation-display'
import SourceDisplay from './source-display'
import ConditionDisplay from './condition-display'
import { describe } from 'node:test'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import React from 'react'

export default function EquipmentCard({ value }: { value: Equipment }) {
  // eventually should this come from the API?
  let conditionMap: any = {
    fleeing: {
      name: 'fleeing',
      description:
        "You're forced to run away due to fear or some other compulsion. On your turn, you must spend each of your actions trying to escape the source of the fleeing condition as expediently as possible (such as by using move actions to flee, or opening doors barring your escape). The source is usually the effect or caster that gave you the condition, though some effects might define something else as the source. You can't Delay or Ready while fleeing.",
      source: {
        title: 'Core Rulebook',
        page: '620',
      },
    },
  }

  let result: string | any[] = value.description
  if (value.description.includes('@condition:')) {
    const key = value.description.split('@condition:')[1].split(' ')[0] // this is pretty hacky
    let descriptionTokens: any[] = value.description.split(`@condition:${key}`)

    result = []
    for (var i = 0; i < descriptionTokens.length; i++) {
      let mapping = [
        descriptionTokens[i],
        i !== descriptionTokens.length - 1 &&
          React.createElement(ConditionDisplay, { value: conditionMap[key] }),
      ]
      result = result.concat(mapping)
    }
  }

  return (
    <div
      className={`grid grid-cols-1 w-144 p-3 border border-slate-400 rounded bg-slate-800 shadow-slate-400 shadow ${roboto_serif.className}`}
    >
      <CardHeader
        name={value.name}
        type="Item"
        level={value.level ?? value.types?.map((val) => val.level)}
      ></CardHeader>
      {value.traits && (
        <Traits rarity={value.rarity} traits={value.traits}></Traits>
      )}
      <div className="text-sm">
        <PriceLabel value={value.price}></PriceLabel>
        <OptionalFields value={value}></OptionalFields>
        <ActivationLabel value={value.activation}></ActivationLabel>
      </div>
      <Separator.Root
        className="w-full bg-slate-400	h-px"
        style={{ margin: '10px 0' }}
      />
      <div className="text-xs">
        <div>{result}</div>
        <EquipmentTypesList
          itemName={value.name}
          variants={value.types}
        ></EquipmentTypesList>
      </div>
      <br />
      <SourceDisplay value={value.source}></SourceDisplay>
    </div>
  )
}

// TODO better type
export function ActivationLabel({ value }: { value: any }) {
  return value ? (
    <div className="flex">
      Activate:&nbsp;<Activation value={value}></Activation>
    </div>
  ) : (
    <></>
  )
}

export function PriceLabel({ value }: { value: Currency[] | undefined }) {
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
export function OptionalFields({ value }: { value: Equipment }) {
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

export function EquipmentTypesList({
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
                  ? `${value.name} ${itemName.toLowerCase()}`
                  : `${itemName.toLowerCase()}`
              }
              valueClassName="italic"
            ></CardLabel>
            ;&nbsp;
            <CardLabel label="Level" value={`${value.level}`}></CardLabel>
            ;&nbsp;
            <PriceLabel value={value.price}></PriceLabel>
          </div>
          <div>{value.description}</div>
        </div>
      ))}
    </div>
  ) : (
    <></>
  )
}
