'use client'

import { Equipment } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Separator from '@radix-ui/react-separator'

export default function EquipmentCard({ value }: { value: Equipment }) {
  return (
    <div
      className={`grid grid-cols-1 w-128 p-3 border border-slate-400 rounded bg-slate-800 ${roboto_serif.className}`}
    >
      {/* style header!!! */}
      <div className="grid grid-cols-2 justify-between text-xl font-semibold">
        <div className="justify-self-start">{value.name}</div>
        <div className="justify-self-end">Item {value.level}</div>
      </div>
      <div className="text-sm">
        <div>
          <p>
            <span className="font-medium">Source:</span> {value.source}
          </p>
        </div>
        <div>
          <p>
            {' '}
            <span className="font-medium">Price:</span> {value.price}
          </p>
        </div>
        <div>
          <div>
            <span className="font-medium">Bulk:</span> {value.bulk};{' '}
            <span className="font-medium">Hands:</span> {value.hands}
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
