'use client'

import { Heritage } from '@/models/db/heritage'
import { RefObject } from 'react'
import Card from '../card/card'

export default function HeritageCard({
  reference,
  value,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Heritage
  collapsible?: boolean
  onRemoved?: (item: Heritage) => void
}) {
  return (
    <Card
      reference={reference}
      data={value}
      type={`${value.ancestry} heritage`}
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
