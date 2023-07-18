'use client'

import Trait from '@/models/trait'
import Card from '../card/card'

export default function TraitCard({
  value,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  value: Trait
  contentTextSizeClassName?: string
  collapsible?: boolean
  onRemoved?: (item: Trait) => void
}) {
  return (
    <Card
      data={value}
      contentTextSizeClassName={contentTextSizeClassName}
      type="Trait"
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
