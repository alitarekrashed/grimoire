'use client'

import { Currency, Equipment, EquipmentVariantType } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'
import React, { use, useEffect, useState } from 'react'
import Activation from './activation-display'
import CardHeader from './card-header'
import CardLabel from './card-label'
import ConditionDisplay from './condition-display'
import SourceDisplay from './source-display'
import Traits from './traits-display'

export default function EquipmentCard({ value }: { value: Equipment }) {
  const [description, setDescription]: [
    string | any[],
    Dispatch<SetStateAction<string | any[]>>,
  ] = useState(value.description)

  const fetchConditions = () => {
    let newDescription: string | any[] = description
    if (newDescription.includes('@condition:')) {
      const key = newDescription.split('@condition:')[1].split(' ')[0] // this is pretty hacky
      let descriptionTokens: any[] = newDescription.split(`@condition:${key}`)

      fetch('http://localhost:3000/api/conditions', {
        cache: 'no-store',
      })
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          newDescription = []
          for (var i = 0; i < descriptionTokens.length; i++) {
            let mapping: string[] = [
              descriptionTokens[i],
              i !== descriptionTokens.length - 1 &&
                React.createElement(ConditionDisplay, {
                  value: data.data[key],
                  key: data.data[key].name, // should be id really
                }),
            ]
            newDescription = newDescription.concat(mapping)
          }
          setDescription(newDescription)
        })
    }
  }

  useEffect(() => {
    fetchConditions()
  }, [])

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
        <div>{description}</div>
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
