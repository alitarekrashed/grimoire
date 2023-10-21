'use client'

import {
  Feat,
  Prerequisite,
  PrerequisiteAttributeValue,
  PrerequisiteSkillValue,
} from '@/models/db/feat'
import { RefObject } from 'react'
import Card from '../card/card'
import { LabelsList } from '../labels-list/labels-list'
import { SavingThrowDisplay } from '../activation-displays/activation-description'

export default function FeatCard({
  reference,
  value,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  value: Feat
  collapsible?: boolean
  onRemoved?: (item: Feat) => void
}) {
  const attributes = (
    <div className="text-sm">
      {value?.prerequisites && (
        <LabelsList
          fieldDefinitions={[
            {
              label: 'Prerequisites',
              value: value.prerequisites
                .map((val) => renderPrerequisite(val))
                .join('; '),
            },
          ]}
        ></LabelsList>
      )}
    </div>
  )

  const additionalContent = value.saving_throw ? (
    <div className="mt-2">
      <SavingThrowDisplay value={value.saving_throw}></SavingThrowDisplay>
    </div>
  ) : (
    <></>
  )

  return (
    <Card
      reference={reference}
      data={value}
      type="Feat"
      level={value.level}
      attributes={attributes}
      activation={value.activation}
      additionalContent={additionalContent}
      traits={value.traits}
      collapsible={collapsible}
      onRemoved={onRemoved}
    ></Card>
  )
}

function renderPrerequisite(prerequisite: Prerequisite): string {
  if (prerequisite.type === 'SKILL') {
    const skillPrereq = prerequisite.value as PrerequisiteSkillValue
    return `${skillPrereq.minimum_rank} in ${skillPrereq.skill}`
  } else if (prerequisite.type === 'ATTRIBUTE') {
    const attributePrereq = prerequisite.value as PrerequisiteAttributeValue
    return `${attributePrereq.attribute}   ${
      attributePrereq.modifier >= 0 ? '+' : '-'
    }${attributePrereq.modifier}`
  } else {
    return prerequisite.value
  }
  return ''
}
