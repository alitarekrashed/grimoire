import { CharacterEntity } from '@/models/db/character-entity'
import { SourcedFeature } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { SkillSelectionFeatureValue } from '@/models/db/feature'
import { CalculatedProficiency, SkillType } from '@/models/statistic'

function getSkillChoices(
  existingProficiencies: Map<SkillType, CalculatedProficiency>
): string[] {
  let choices: string[] = []

  Array.from(existingProficiencies.entries()).forEach((entry) => {
    if (entry[1].rank === 'untrained') {
      choices.push(entry[0])
    }
  })

  return choices
}

export function SkillsModal({
  character,
  proficiencies,
  onSkillsUpdate,
}: {
  character: CharacterEntity
  proficiencies: Map<SkillType, CalculatedProficiency>
  onSkillsUpdate: (feature: { '1': SourcedFeature[] }) => void
}) {
  const [modifiedCharacter, setModifiedCharacter] = useState<CharacterEntity>()
  const [choices, setChoices] = useState<string[]>([])

  useEffect(() => {
    setChoices(getSkillChoices(proficiencies))
  }, [proficiencies])

  useEffect(() => {
    setModifiedCharacter(cloneDeep(character))
  }, [character])

  const trigger = (
    <span
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      Skills
    </span>
  )

  let skillSelections: SourcedFeature[] = []
  if (modifiedCharacter) {
    skillSelections = modifiedCharacter.features['1'].filter(
      (sourced) => sourced.feature.type === 'SKILL_SELECTION'
    )
  }

  const currentSelections = skillSelections.map(
    (choice: SourcedFeature) => choice.feature.value.value
  )

  const body = (
    <div className={`${roboto_condensed.className} p-2`}>
      {skillSelections.map((choice: SourcedFeature, i: number) => {
        const skillSelection = choice.feature
          .value as SkillSelectionFeatureValue
        return (
          <React.Fragment key={i}>
            <select
              className="bg-stone-700 mr-2 rounded-md"
              value={skillSelection.value ?? ''}
              onChange={(e) => {
                let updated = cloneDeep(modifiedCharacter)!
                updated.features['1'].filter(
                  (sourced) => sourced.feature.type === 'SKILL_SELECTION'
                )[i].feature.value.value = e.target.value
                setModifiedCharacter(updated)
              }}
            >
              <option value={skillSelection.value}>
                {skillSelection.value}
              </option>
              {choices
                .filter((choice) => {
                  if (currentSelections.includes(choice)) {
                    return false
                  }
                  if (skillSelection.configuration.options === 'Free') {
                    return true
                  } else {
                    return skillSelection.configuration.options.includes(choice)
                  }
                })
                .map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
            </select>
          </React.Fragment>
        )
      })}
    </div>
  )
  return (
    <Modal
      size="small"
      trigger={trigger}
      body={body}
      closeButtons={[
        {
          label: 'Save',
          onClick: () => {
            onSkillsUpdate(modifiedCharacter?.features ?? character.features)
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            onSkillsUpdate(character.features)
          },
        },
      ]}
    ></Modal>
  )
}
