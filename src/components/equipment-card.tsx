'use client'

import { Currency, Equipment, EquipmentVariantType } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'
import { isString } from 'lodash'
import { useEffect, useState } from 'react'
import Activation from './activation-display'
import CardHeader from './card-header'
import CardLabel from './card-label'
import SourceDisplay from './source-display'
import Traits from './traits-display'
import { parseDescription } from '@/utils/services/description-parser.service'

export default function EquipmentCard({ value }: { value: Equipment }) {
  const [description, setDescription] = useState([value.description])
  const [fadeIn, setFadeIn] = useState(false)

  const parseDescriptionForRendering = () => {
    ;(async () => {
      let updated: any[] = await parseDescription(description)
      setDescription(updated)
    })()
  }

  useEffect(() => {
    parseDescriptionForRendering()
    setTimeout(() => {
      setFadeIn(() => true)
    }, 1)
  }, [])

  return (
    <div
      className={`transition-opacity duration-1000 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      } grid grid-cols-1 w-144 p-3 border border-slate-400 rounded bg-slate-800 shadow-slate-400 shadow ${
        roboto_serif.className
      }`}
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
        <div>
          {/* TODO This allows the descriptions be html-like but comes at the risk of injection attacks... need to revist */}
          {/* TODO look into: https://www.npmjs.com/package/react-sanitized-html */}
          {description.map((value, index) => {
            return isString(value) ? (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: value }}
              ></span>
            ) : (
              <span key={index}>{value}</span>
            )
          })}
        </div>
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
          <div>{value.description}</div>
        </div>
      ))}
    </div>
  ) : (
    <></>
  )
}
