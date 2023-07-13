'use client'

import Condition from '@/models/condition'
import { roboto_serif } from '@/utils/fonts'
import * as HoverCard from '@radix-ui/react-hover-card'
import styles from './condition-display.module.css'
import { useEffect, useState } from 'react'
import { parseDescription } from '@/utils/services/description-parser.service'

// TODO eventually the display should be clickable and allow the user to go to a page for the condition?
export default function ConditionDisplay({ value }: { value: Condition }) {
  // TODO consider extracting all the description stuff into a ParsedDescription component?
  // need to do something to prevent or limit the nested hovers
  const [description, setDescription] = useState([value.description])

  const parseDescriptionForRendering = () => {
    ;(async () => {
      let updated: any[] = await parseDescription(description)
      setDescription(updated)
    })()
  }

  useEffect(() => {
    parseDescriptionForRendering()
  }, [])

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
              {description}
            </div>

            <HoverCard.Arrow className="fill-slate-600" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}
