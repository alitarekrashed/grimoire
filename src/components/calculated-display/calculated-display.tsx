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
      title={
        <span className="underline decoration-dotted" tabIndex={0}>
          {includeOperator && reduced > 0 && '+'}
          {reduced}
        </span>
      }
      content={
        <div>
          {values.map((value: ModifierValue, index: number) => (
            <span key={`${value.source}-${value.type}`}>
              {index > 0 && (value.value >= 0 ? ' + ' : ' - ')}
              {Math.abs(value.value)}
              &nbsp;[{value.source}]
            </span>
          ))}
        </div>
      }
    ></HoverDisplay>
  )
}
