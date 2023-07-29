'use client'

import Card from '../card/card'
import { RefObject } from 'react'
import Rule from '@/models/db/rule'

export default function RuleCard({
  reference,
  value,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Rule
  collapsible?: boolean
  onRemoved?: (item: Rule) => void
}) {
  return (
    <Card
      reference={reference}
      data={value}
      type="Rule"
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
