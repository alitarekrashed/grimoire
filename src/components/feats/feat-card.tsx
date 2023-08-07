'use client'

import { Background } from '@/models/db/background'
import { RefObject } from 'react'
import Card from '../card/card'
import { Feat, Prerequisite, PrerequisiteSkillValue } from '@/models/db/feat'
import { LabelsList } from '../labels-list/labels-list'
import { render } from 'react-dom'

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
  return (
    <Card
      reference={reference}
      data={value}
      type="Feat"
      attributes={attributes}
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
  }
  return ''
}
