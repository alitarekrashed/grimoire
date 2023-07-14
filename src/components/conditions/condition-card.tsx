'use client'

import Condition from '@/models/condition'
import { useState } from 'react'
import Card from '../card/card'

export default function ConditionCard({
  value,
  contentTextSizeClassName,
}: {
  value: Condition
  contentTextSizeClassName?: string
}) {
  const [fadeIn, setFadeIn] = useState(false)

  return (
    <Card
      data={value}
      contentTextSizeClassName={contentTextSizeClassName}
      type="Condition"
    ></Card>
  )
}
