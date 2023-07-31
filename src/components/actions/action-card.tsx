'use client'

import { Action } from '@/models/db/action'
import { RefObject } from 'react'
import Card from '../card/card'

export default function ActionCard({
  reference,
  value,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Action
  collapsible?: boolean
  onRemoved?: (item: Action) => void
}) {
  let activation = { ...value.activation }

  return (
    <Card
      reference={reference}
      data={value}
      type="Action"
      activation={activation}
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
