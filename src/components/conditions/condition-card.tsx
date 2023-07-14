'use client'

import Condition from '@/models/condition'
import { useState } from 'react'
import Card from '../card/card'

export default function ConditionCard({
  value,
  contentTextSizeClassName,
  collapsible,
  closeable,
}: {
  value: Condition
  contentTextSizeClassName?: string
  collapsible?: boolean
  closeable?: boolean
}) {
  const [fadeIn, setFadeIn] = useState(false)

  return (
    <Card
      data={value}
      contentTextSizeClassName={contentTextSizeClassName}
      type="Condition"
      collapsible={collapsible}
      closeable={closeable}
    ></Card>
  )
}
