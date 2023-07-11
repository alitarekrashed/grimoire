'use client'

import Condition from '@/models/condition'
import { Currency, Equipment, EquipmentVariantType } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'
import { isString } from 'lodash'
import React, { useEffect, useState } from 'react'
import Activation from './activation-display'
import CardHeader from './card-header'
import CardLabel from './card-label'
import ConditionDisplay from './condition-display'
import SourceDisplay from './source-display'
import Traits from './traits-display'

export default function EquipmentCard({ value }: { value: Equipment }) {
  const [description, setDescription] = useState([value.description])

  const fetchConditions = () => {
    ;(async () => {
      let updated: any[] = await tokenizeDescriptionForConditions(description)
      setDescription(updated)
    })()
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

export function tokenizeDescriptionForConditions(description: any[]) {
  return (async () => {
    let tokenizedDescription = [...description]
    for (let i = 0; i < tokenizedDescription.length; i++) {
      let currentPart = tokenizedDescription[i]

      if (isString(currentPart) && currentPart.includes('@condition:')) {
        const brokenUpDescription = await updateDescription(currentPart)
        tokenizedDescription.splice(i, 1, ...brokenUpDescription)
      }
    }
    return tokenizedDescription
  })()
}

export function updateDescription(currentPart: string): Promise<any[]> {
  return (async () => {
    const key = currentPart.split('@condition:')[1].split(' ')[0] // this is pretty hacky
    let tokens: any[] = currentPart.split(`@condition:${key}`)
    const condition: Condition = await retrieveCondition(key)
    let newParts: any[] = []
    for (let j = 0; j < tokens.length; j++) {
      let mapping: any[] = [tokens[j]]
      j !== tokens.length - 1 &&
        mapping.push(
          React.createElement(ConditionDisplay, {
            value: condition,
            key: condition.identifier,
          })
        )
      newParts = newParts.concat(mapping)
    }
    return newParts
  })()
}

export function retrieveCondition(key: string): Promise<Condition> {
  return (async () => {
    const condition = await (
      await fetch(`http://localhost:3000/api/conditions/${key}`, {
        cache: 'no-store',
      })
    ).json()
    return condition
  })()
}

// export function tokenizeDescriptionForConditions(
//   description: any[],
//   setter: (value: any) => void
// ) {
//   let tokenizedDescription = [...description]
//   for (let i = 0; i < tokenizedDescription.length; i++) {
//     let currentPart = tokenizedDescription[i]

//     if (isString(currentPart) && currentPart.includes('@condition:')) {
//       const key = currentPart.split('@condition:')[1].split(' ')[0] // this is pretty hacky
//       let tokens: any[] = currentPart.split(`@condition:${key}`)

//       fetch(`http://localhost:3000/api/conditions/${key}`, {
//         cache: 'no-store',
//       })
//         .then((response) => response.json())
// .then((condition: Condition) => {
//   let newParts: any[] = []
//   for (let j = 0; j < tokens.length; j++) {
//     let mapping: any[] = [tokens[j]]
//     j !== tokens.length - 1 &&
//       mapping.push(
//         React.createElement(ConditionDisplay, {
//           value: condition,
//           key: condition.identifier,
//         })
//       )
//     newParts = newParts.concat(mapping)
//   }
//   tokenizedDescription.splice(i, 1, ...newParts)
//   setter(tokenizedDescription)
//         })
//     }
//   }
// }

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
