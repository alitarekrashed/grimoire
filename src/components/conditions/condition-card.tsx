'use client'

import Condition from '@/models/condition'
import { useState } from 'react'
import Card, { CardData } from '../card/card'

export default function ConditionCard({
  value,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  value: Condition
  contentTextSizeClassName?: string
  collapsible?: boolean
  onRemoved?: (item: Condition) => void
}) {
  const [fadeIn, setFadeIn] = useState(false)

  return (
    <Card
      data={value}
      contentTextSizeClassName={contentTextSizeClassName}
      type="Condition"
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
