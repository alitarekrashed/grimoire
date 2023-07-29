'use client'

import { Ancestry } from '@/models/db/ancestry'
import { RefObject } from 'react'
import Card from '../card/card'

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
  return (
    <Card
      reference={reference}
      data={value}
      type="Ancestry"
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
