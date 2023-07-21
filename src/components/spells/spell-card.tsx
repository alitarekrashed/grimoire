'use client'

import Trait from '@/models/trait'
import Card from '../card/card'
import { Spell } from '@/models/spell'

export default function SpellCard({
  value,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  value: Spell
  contentTextSizeClassName?: string
  collapsible?: boolean
  onRemoved?: (item: Spell) => void
}) {
  const type = value.rank === 0 ? 'Cantrip' : 'Spell'
  let activation = { ...value.activation }
  activation.override_label = 'Cast'
  activation.action = undefined

  return (
    <Card
      data={value}
      type={type}
      level={value.rank}
      traits={value.traits}
      rarity={value.rarity}
      activation={activation}
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}
