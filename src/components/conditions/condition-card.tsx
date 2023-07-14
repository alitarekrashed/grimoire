'use client'

import Condition from '@/models/condition'
import { useState } from 'react'
import Card from '../card/card'

export default function ConditionCard({
  value,
  contentTextSizeClassName,
  collapsible,
  onClosed,
}: {
  value: Condition
  contentTextSizeClassName?: string
  collapsible?: boolean
  onClosed?: (item: CardData) => {}
}) {
  const [fadeIn, setFadeIn] = useState(false)

  return (
    <Card
      data={value}
      contentTextSizeClassName={contentTextSizeClassName}
      type="Condition"
      collapsible={collapsible}
      onClosed={onClosed}
    ></Card>
  )
}
