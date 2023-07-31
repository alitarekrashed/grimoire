'use client'

import Card from '../card/card'
import {
  HeightenedDefinition,
  HeightenedExplicit,
  HeightenedFormula,
  Spell,
} from '@/models/db/spell'
import { FieldDefinition, LabelsList } from '../labels-list/labels-list'
import * as Separator from '@radix-ui/react-separator'
import build from 'next/dist/build'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { RefObject } from 'react'

export default function SpellCard({
  reference,
  value,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Spell
  collapsible?: boolean
  onRemoved?: (item: Spell) => void
}) {
  const type = value.rank === 0 ? 'Cantrip' : 'Spell'
  let activation = { ...value.activation }
  activation.override_label = 'Cast'

  const heightenedLevels: FieldDefinition[] = value.heightened
    ? buildHeightenedFields(value.heightened)
    : []
  const additionalContent = (
    <>
      {value.saving_throw && (
        <div className="mt-2">
          <SavingThrowDisplay value={value.saving_throw}></SavingThrowDisplay>
        </div>
      )}
      <Separator.Root
        className="w-full bg-stone-400	h-px"
        style={{ margin: '10px 0' }}
      />
      <div className="mb-1">
        {heightenedLevels.map((level, index) => (
          <div key={level.label}>
            <LabelsList fieldDefinitions={[level]}></LabelsList>
            {index < heightenedLevels.length - 1 && (
              <>
                <br /> <br />
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <Card
      reference={reference}
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

function buildHeightenedFields(
  heightenedDefinition: HeightenedDefinition
): FieldDefinition[] {
  if (heightenedDefinition.type === 'formula') {
    const formula = heightenedDefinition.value as HeightenedFormula
    return [
      {
        label: `Heightened (${formula.level_modifier}+)`,
        value: formula.description,
      },
    ]
  } else {
    const explicit = heightenedDefinition.value as HeightenedExplicit[]
    return explicit.map((val: HeightenedExplicit) => ({
      label: `Heightened (${withOrdinalSuffix(val.level)})`,
      value: val.description,
    }))
  }
}

// from https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
function withOrdinalSuffix(i: number): string {
  var j = i % 10,
    k = i % 100
  if (j == 1 && k != 11) {
    return i + 'st'
  }
  if (j == 2 && k != 12) {
    return i + 'nd'
  }
  if (j == 3 && k != 13) {
    return i + 'rd'
  }
  return i + 'th'
}
