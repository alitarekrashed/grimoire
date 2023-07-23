'use client'

import Condition from '@/models/condition'
import Card from '../card/card'

export default function ConditionCard({
  reference,
  value,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  reference?: any
  value: Condition
  contentTextSizeClassName?: string
  collapsible?: boolean
  onRemoved?: (item: Condition) => void
}) {
  return (
    <Card
      reference={reference}
      data={value}
      contentTextSizeClassName={contentTextSizeClassName}
      type="Condition"
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
