'use client'

import { Equipment } from '@/models/equipment'
import * as Separator from '@radix-ui/react-separator'

export default function EquipmentCard({ value }: { value: Equipment }) {
  return (
    <div className="grid grid-cols-1 w-128">
      {/* style header!!! */}
      <div className="grid grid-cols-2 justify-between">
        <div className="justify-self-start">{value.name}</div>
        <div className="justify-self-end">Item {value.level}</div>
      </div>
      <div>
        <p>Source: {value.source}</p>
      </div>
      <div>
        <p>Price: {value.price}</p>
      </div>
      <div>
        <div>
          Bulk: {value.bulk}; Hands: {value.hands}
        </div>
      </div>
      <Separator.Root
        className="w-full bg-zinc-600	h-px"
        style={{ margin: '15px 0' }}
      />
      <div>{value.description}</div>
    </div>
  )
}
