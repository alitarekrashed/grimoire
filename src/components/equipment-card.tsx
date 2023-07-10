'use client'

import { Equipment } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'
import CardLabel from './card-label'
import CardHeader from './card-header'
import Traits from './traits'
import Activation from './activation'

export default function EquipmentCard({ value }: { value: Equipment }) {
  return (
    <div
      className={`grid grid-cols-1 w-144 p-3 border border-slate-400 rounded bg-slate-800 shadow-slate-400 shadow	 ${roboto_serif.className}`}
    >
      <CardHeader
        name={value.name}
        type="Item"
        level={value.level}
      ></CardHeader>
      {value.traits && <Traits value={value.traits}></Traits>}
      <div className="text-sm">
        <div>
          <CardLabel label="Price" value={value.price}></CardLabel>
        </div>
        <OptionalFields value={value}></OptionalFields>
        <ActivationLabel value={value.activation}></ActivationLabel>
      </div>
      <Separator.Root
        className="w-full bg-slate-400	h-px"
        style={{ margin: '15px 0' }}
      />
      <div className="text-xs">{value.description}</div>
      <br />
      <p className="text-[9px] italic justify-self-end">
        <span>Source:</span> {value.source}
      </p>
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

export function OptionalFields({ value }: { value: Equipment }) {
  let optionalFields = []
  if (value.hands) {
    optionalFields.length > 0 && optionalFields.push('; ')
    optionalFields.push(
      <CardLabel label="Hands" value={value.hands}></CardLabel>
    )
  }
  if (value.usage) {
    optionalFields.length > 0 && optionalFields.push('; ')
    optionalFields.push(
      <CardLabel label="Usage" value={value.usage}></CardLabel>
    )
  }
  if (value.bulk) {
    optionalFields.length > 0 && optionalFields.push('; ')
    optionalFields.push(<CardLabel label="Bulk" value={value.bulk}></CardLabel>)
  }

  return optionalFields
}
