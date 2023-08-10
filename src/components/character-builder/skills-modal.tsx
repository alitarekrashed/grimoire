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
  skillFeatures,
  proficiencies,
  onSkillsUpdate,
}: {
  skillFeatures: SourcedFeature[]
  proficiencies: Map<SkillType, CalculatedProficiency>
  onSkillsUpdate: (features: SourcedFeature[]) => void
}) {
  const [updatedFeatures, setUpdatedFeatures] = useState<SourcedFeature[]>()
  const [choices, setChoices] = useState<string[]>([])

  useEffect(() => {
    setChoices(getSkillChoices(proficiencies))
  }, [proficiencies])

  useEffect(() => {
    setUpdatedFeatures(cloneDeep(skillFeatures))
  }, [skillFeatures])

  let totalCount = 0
  let setCount = 0
  skillFeatures.forEach((sourced) => {
    totalCount += sourced.feature.value.value.length
    setCount += sourced.feature.value.value.filter(
      (value: string) => value
    ).length
  })

  const trigger = (
    <span
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      Skills {setCount}/{totalCount}
    </span>
  )

  const skillChoices =
    updatedFeatures &&
    updatedFeatures.map((sourced: SourcedFeature, index) => {
      const skillSelection = sourced.feature.value as SkillSelectionFeatureValue

      return skillSelection.value.map((skill: string, innerIndex) => {
        return (
          <React.Fragment key={`${skill}-${index}-${innerIndex}`}>
            <select
              className="bg-stone-700 mr-2 rounded-md"
              value={skill ?? ''}
              onChange={(e) => {
                let updated = cloneDeep(updatedFeatures)!
                updated[index].feature.value.value[innerIndex] = e.target.value
                setUpdatedFeatures(updated)
              }}
            >
              <option value={skill}>{skill}</option>
              {choices
                .filter((choice: string) => {
                  const alreadyChosen = updatedFeatures
                    .map(
                      (feature: SourcedFeature) => feature.feature.value.value
                    )
                    .some((skills: string[]) => skills.includes(choice))
                  if (alreadyChosen) {
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
      })
    })

  const body = updatedFeatures && (
    <div className={`${roboto_condensed.className} p-2`}>{skillChoices}</div>
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
            onSkillsUpdate(updatedFeatures ?? [])
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            onSkillsUpdate(skillFeatures)
          },
        },
      ]}
    ></Modal>
  )
}
