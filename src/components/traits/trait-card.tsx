'use client'

import Trait from '@/models/trait'
import Card from '../card/card'

export default function TraitCard({
  reference,
  value,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  reference?: any
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
