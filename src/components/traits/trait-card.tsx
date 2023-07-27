'use client'

import Trait from '@/models/db/trait'
import Card from '../card/card'
import { RefObject } from 'react'

export default function TraitCard({
  reference,
  value,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Trait
  contentTextSizeClassName?: string
  collapsible?: boolean
  onRemoved?: (item: Trait) => void
}) {
  return (
    <Card
      reference={reference}
      data={value}
      contentTextSizeClassName={contentTextSizeClassName}
      type="Trait"
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
