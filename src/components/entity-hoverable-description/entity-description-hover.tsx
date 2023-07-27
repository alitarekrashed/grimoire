'use client'

import { EntityModel } from '@/models/db/entity-model'
import { roboto_serif } from '@/utils/fonts'
import * as HoverCard from '@radix-ui/react-hover-card'
import styles from './entity-description-hover.module.css'
import { ParsedDescription } from '../parsed-description/parsed-description'

// TODO eventually the display should be clickable and allow the user to go to a page for the condition?
// TODO maybe this should open a modal instead of a link to a new page
export default function EntityHoverableDescription({
  value,
}: {
  value: EntityModel
}) {
  return (
    <>
      <HoverCard.Root openDelay={200} closeDelay={100}>
        <HoverCard.Trigger>
          <span className="underline decoration-dotted" tabIndex={0}>
            {value.name}
          </span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content>
            <div
              className={`${styles.hoverCardContent} w-128 text-xs bg-stone-600 shadow-stone-400 shadow ${roboto_serif.className}`}
            >
              <ParsedDescription
                description={value.description}
              ></ParsedDescription>
            </div>
            <HoverCard.Arrow className="fill-slate-600" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}
