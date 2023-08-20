'use client'

import { EntityModel } from '@/models/db/entity-model'
import { HoverDisplay } from '../hover-display/hover-display'
import { ParsedDescription } from '../parsed-description/parsed-description'

// TODO eventually the display should be clickable and allow the user to go to a page for the condition?
// TODO maybe this should open a modal instead of a link to a new page
export default function EntityHoverableDescription({
  name,
  value,
}: {
  name?: string
  value: EntityModel
}) {
  return (
    <HoverDisplay
      title={
        <span className="underline decoration-dotted" tabIndex={0}>
          {name ?? value.name}
        </span>
      }
      content={
        <div>
          <ParsedDescription
            description={value.description}
          ></ParsedDescription>
        </div>
      }
    ></HoverDisplay>
  )
}
