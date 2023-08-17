'use client'

import { roboto_serif } from '@/utils/fonts'
import * as HoverCard from '@radix-ui/react-hover-card'
import styles from './calculated-display.module.css'

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
    <>
      <HoverCard.Root openDelay={200} closeDelay={100}>
        <HoverCard.Trigger>
          <span className="underline decoration-dotted" tabIndex={0}>
            {includeOperator && reduced > 0 && '+'}
            {reduced}
          </span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content>
            <div
              className={`${styles.hoverDisplayContent} w-128 text-xs bg-stone-600 shadow-stone-400 shadow ${roboto_serif.className}`}
            >
              {values.map((value: ModifierValue, index: number) => (
                <span key={`${value.source}-${value.type}`}>
                  {index > 0 && (value.value >= 0 ? ' + ' : ' - ')}
                  {Math.abs(value.value)}
                  &nbsp;[{value.source}]
                </span>
              ))}
            </div>
            <HoverCard.Arrow className="fill-stone-600" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}
