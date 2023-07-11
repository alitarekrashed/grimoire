'use client'

import Condition from '@/models/condition'
import { roboto_serif } from '@/utils/fonts'
import * as Tooltip from '@radix-ui/react-tooltip'
import styles from './condition-display.module.css'

// TODO eventually the display should be clickable and allow the user to go to a page for the condition?
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
