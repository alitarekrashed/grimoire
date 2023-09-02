'use client'

import { HoverDisplay } from '../base/hover-display'

export interface ModifierValue {
  value: number
  type?: 'circumstance'
  source: string
}

// TODO ALI need to still adjust for type later here...
export default function CalculatedDisplay({
  values,
  includeOperator,
}: {
  values: ModifierValue[]
  includeOperator?: boolean
}) {
  const reduced = values.reduce((sum, value) => sum + value.value, 0)

  return (
    <HoverDisplay
      size="small"
      title={
        <span className="underline decoration-dotted" tabIndex={0}>
          {includeOperator && reduced > 0 && '+'}
          {reduced}
        </span>
      }
      content={
        <div className="flex flex-col">
          {values.map((value: ModifierValue, index: number) => (
            <span
              className="grid grid-cols-6"
              key={`${value.source}-${value.type}`}
            >
              <span className="col-span-1">
                {value.value >= 0 ? ' + ' : ' - '}
                {Math.abs(value.value)}
              </span>
              <span className="col-span-5 text-[10px]">
                &nbsp;{value.source}
              </span>
            </span>
          ))}
        </div>
      }
    ></HoverDisplay>
  )
}
