'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import Condition from '@/models/condition'
import styles from './condition-display.module.css'
import { roboto_serif } from '@/utils/fonts'

export default function ConditionDisplay({ value }: { value: Condition }) {
  return (
    <>
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span className="underline" tabIndex={0}>
              {value.name}
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              <div
                className={`${styles.conditionTooltipContent} w-128 text-xs bg-slate-600 shadow-slate-400 shadow ${roboto_serif.className}`}
              >
                {value.description}
              </div>
              <Tooltip.Arrow className="fill-slate-600" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </>
  )
}
