'use client'

import { Ancestry } from '@/models/db/ancestry'
import { RefObject } from 'react'
import Card from '../card/card'
import { LabelsList } from '../labels-list/labels-list'
import * as Separator from '@radix-ui/react-separator'

export default function AncestryCard({
  reference,
  value,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Ancestry
  collapsible?: boolean
  onRemoved?: (item: Ancestry) => void
}) {
  // TODO need to render langauges, attribute bonuses and flaws, as well as any additional features granted
  const additionalContent = (
    <div>
      <Separator.Root
        className="w-full bg-stone-400	h-px"
        style={{ margin: '10px 0' }}
      />
      <LabelsList
        labelClassName="font-bold"
        fieldDefinitions={[
          {
            label: 'Hit points',
            value: value.hitpoints,
          },
          {
            label: 'Size',
            value: value.size,
          },
          {
            label: 'Speed',
            value: value.speed,
          },
        ]}
      ></LabelsList>
    </div>
  )

  return (
    <Card
      reference={reference}
      data={value}
      type="Ancestry"
      collapsible={collapsible}
      additionalContent={additionalContent}
      onRemoved={onRemoved}
    ></Card>
  )
}
