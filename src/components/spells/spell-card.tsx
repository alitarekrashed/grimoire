'use client'

import Card from '../card/card'
import {
  HeightenedDefinition,
  HeightenedExplicit,
  HeightenedFormula,
  Spell,
} from '@/models/db/spell'
import { FieldDefinition, LabelsList } from '../labels-list/labels-list'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { RefObject } from 'react'
import { Separator } from '../base/separator'

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
  const type = getType(value)
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
      <Separator className="my-2"></Separator>
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
    return explicit.map((val: HeightenedExplicit) => {
      if (val.level) {
        return {
          label: `Heightened (${withOrdinalSuffix(val.level)})`,
          value: val.description,
        }
      }
      return {
        label: `Heightened`,
        value: val.description,
      }
    })
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

function getType(value: Spell) {
  if (value.traits.includes('cantrip')) {
    return 'Cantrip'
  }
  if (value.focus) {
    return 'Focus'
  }
  return 'Spell'
}
