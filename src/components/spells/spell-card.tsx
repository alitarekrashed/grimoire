'use client'

import Trait from '@/models/trait'
import Card from '../card/card'
import { Spell } from '@/models/spell'
import { LabelsList } from '../labels-list/labels-list'
import * as Separator from '@radix-ui/react-separator'

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

  const additionalContent = (
    <>
      <Separator.Root
        className="w-full bg-stone-400	h-px"
        style={{ margin: '10px 0' }}
      />
      <div className="mb-1">
        <LabelsList
          fieldDefinitions={[
            {
              label: `Heightened (${value.heightened.level_modifier}+)`,
              value: value.heightened.description,
            },
          ]}
        ></LabelsList>
      </div>
    </>
  )

  return (
    <Card
      data={value}
      type={type}
      level={value.rank}
      traits={value.traits}
      rarity={value.rarity}
      activation={activation}
      collapsible={collapsible}
      additionalContent={additionalContent}
      onRemoved={onRemoved}
    ></Card>
  )
}
