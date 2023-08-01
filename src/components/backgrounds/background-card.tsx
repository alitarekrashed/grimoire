'use client'

import { Background } from '@/models/db/background'
import { RefObject } from 'react'
import Card from '../card/card'

export default function BackgroundCard({
  reference,
  value,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Background
  collapsible?: boolean
  onRemoved?: (item: Background) => void
}) {
  return (
    <Card
      reference={reference}
      data={value}
      type="Background"
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
