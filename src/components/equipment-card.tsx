'use client'

import { Currency, Equipment, EquipmentVariantType } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'
import CardLabel from './card-label'
import CardHeader from './card-header'
import Traits from './traits-display'
import Activation from './activation-display'
import SourceDisplay from './source-display'

export default function EquipmentCard({ value }: { value: Equipment }) {
  return (
    <div
      className={`grid grid-cols-1 w-144 p-3 border border-slate-400 rounded bg-slate-800 shadow-slate-400 shadow	 ${roboto_serif.className}`}
    >
      <CardHeader
        name={value.name}
        type="Item"
        level={value.level ?? value.types?.map((val) => val.level)}
      ></CardHeader>
      {value.traits && <Traits value={value.traits}></Traits>}
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
        <div>{value.description}</div>
        <EquipmentTypesList value={value.types}></EquipmentTypesList>
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
  value,
}: {
  value: EquipmentVariantType[] | undefined
}) {
  return value ? (
    <div>
      {value.map((val) => (
        <div key={val.name}>
          <Separator.Root
            className="w-full bg-slate-400	h-px"
            style={{ margin: '10px 0' }}
          />
          <div className="inline-flex mb-1">
            <CardLabel
              label="Type"
              value={val.name}
              valueClassName="italic"
            ></CardLabel>
            ;&nbsp;
            <CardLabel label="Level" value={`${val.level}`}></CardLabel>;&nbsp;
            <PriceLabel value={val.price}></PriceLabel>
          </div>
          <div>{val.description}</div>
        </div>
      ))}
    </div>
  ) : (
    <></>
  )
}
