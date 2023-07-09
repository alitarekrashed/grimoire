'use client'

import { Equipment } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'
import CardLabel from './card-label'
import CardHeader from './card-header'

export default function EquipmentCard({ value }: { value: Equipment }) {
  return (
    <div
      className={`grid grid-cols-1 w-128 p-3 border border-slate-400 rounded bg-slate-800 shadow-slate-400 shadow	 ${roboto_serif.className}`}
    >
      <CardHeader
        name={value.name}
        type="Item"
        level={value.level}
      ></CardHeader>
      <div className="text-sm">
        <div>
          <p>
            <CardLabel label="Source" value={value.source}></CardLabel>
          </p>
        </div>
        <div>
          <p>
            <CardLabel label="Price" value={value.price}></CardLabel>
          </p>
        </div>
        <div>
          <div>
            <CardLabel label="Bulk" value={value.bulk}></CardLabel>;&nbsp;
            <CardLabel label="Hands" value={value.hands}></CardLabel>
          </div>
        </div>
      </div>
      <Separator.Root
        className="w-full bg-slate-400	h-px"
        style={{ margin: '15px 0' }}
      />
      <div className="text-xs">{value.description}</div>
    </div>
  )
}
