'use client'

import Condition from '@/models/condition'
import { roboto_serif } from '@/utils/fonts'
import * as HoverCard from '@radix-ui/react-hover-card'
import styles from './condition-hover.module.css'
import { ParsedDescription } from '../parsed-description/parsed-description'
import Link from 'next/link'

// TODO eventually the display should be clickable and allow the user to go to a page for the condition?
// TODO maybe this should open a modal instead of a link to a new page
export default function ConditionHover({ value }: { value: Condition }) {
  return (
    <>
      <HoverCard.Root openDelay={200} closeDelay={100}>
        <HoverCard.Trigger asChild>
          <Link href={`/reference/conditions/${value.id}`}>
            <span className="underline" tabIndex={0}>
              {value.name}
            </span>
          </Link>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content>
            <div
              className={`${styles.hoverCardContent} w-128 text-xs bg-slate-600 shadow-slate-400 shadow ${roboto_serif.className}`}
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
