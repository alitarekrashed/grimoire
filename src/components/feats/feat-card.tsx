'use client'

import { Feat, Prerequisite, PrerequisiteSkillValue } from '@/models/db/feat'
import { RefObject, useEffect, useState } from 'react'
import Card from '../card/card'
import { LabelsList } from '../labels-list/labels-list'
import { Activation } from '@/models/db/activation'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import { Action } from '@/models/db/action'
import { EntityModel } from '@/models/db/entity-model'

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
      level={value.level}
      attributes={attributes}
      activation={value.activation}
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
