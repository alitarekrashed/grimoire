'use client'

import Condition from '@/models/db/condition'
import Card from '../card/card'
import { RefObject } from 'react'

export default function ConditionCard({
  reference,
  value,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
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
