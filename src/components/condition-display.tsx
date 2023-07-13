'use client'

import Condition from '@/models/condition'
import { roboto_serif } from '@/utils/fonts'
import * as HoverCard from '@radix-ui/react-hover-card'
import styles from './condition-display.module.css'

// TODO eventually the display should be clickable and allow the user to go to a page for the condition?
export default function ConditionDisplay({ value }: { value: Condition }) {
  return (
    <>
      <HoverCard.Root openDelay={200} closeDelay={100}>
        <HoverCard.Trigger>
          <span className="underline" tabIndex={0}>
            {value.name}
          </span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content>
            <div
              className={`${styles.hoverCardContent} w-128 text-xs bg-slate-600 shadow-slate-400 shadow ${roboto_serif.className}`}
            >
              {value.description}
            </div>

            <HoverCard.Arrow className="fill-slate-600" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}
