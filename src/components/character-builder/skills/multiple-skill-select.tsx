import { Feature, SkillSelectionFeatureValue } from '@/models/db/feature'
import { CalculatedProficiency, SkillType } from '@/models/statistic'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Modal } from '../../base/modal'
import { ChoiceSelect } from '../../choice-select/choice-select'
import { PlayerCharacterContext } from '../../character-display/player-character-context'

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

export function MultipleSkillSelect({
  name,
  skillFeatures,
  onSkillsUpdate,
}: {
  name?: string
  skillFeatures: Feature[]
  onSkillsUpdate: (features: Feature[]) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [proficiencies, setProficiencies] = useState<
    Map<SkillType, CalculatedProficiency>
  >(playerCharacter.getSkills(skillFeatures))
  const [updatedFeatures, setUpdatedFeatures] = useState<Feature[]>()
  const [choices, setChoices] = useState<string[]>([])

  useEffect(() => {
    setChoices(getSkillChoices(proficiencies))
  }, [proficiencies])

  useEffect(() => {
    setUpdatedFeatures(cloneDeep(skillFeatures))
    setProficiencies(playerCharacter.getSkills(skillFeatures))
  }, [skillFeatures])

  let totalCount = 0
  let setCount = 0
  skillFeatures.forEach((feature) => {
    totalCount += feature.value.value.length
    setCount += feature.value.value.filter((value: string) => value).length
  })

  const trigger = (
    <button
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      {name ? name : 'Trained Skills'} {setCount}/{totalCount}
    </button>
  )

  let counter = 0

  const skillChoices =
    updatedFeatures &&
    updatedFeatures.map((feature: Feature, index) => {
      const skillSelection = feature.value as SkillSelectionFeatureValue

      return (
        <div key={`skillgroup-${index}`} className="inline-flex gap-2 mb-2">
          {skillSelection.value.map((skill: string, innerIndex) => {
            counter = counter + 1
            return (
              <ChoiceSelect
                key={`skill-${index}-${innerIndex}`}
                value={skill}
                title={`Skill #${counter}`}
                options={choices.filter((choice: string) => {
                  if (choice === skill) {
                    return true
                  }
                  const alreadyChosen = updatedFeatures
                    .map((feature: Feature) => feature.value.value)
                    .some((skills: string[]) => skills.includes(choice))
                  if (alreadyChosen) {
                    return false
                  }
                  if (skillSelection.configuration.options === 'Free') {
                    return true
                  } else {
                    return skillSelection.configuration.options.includes(choice)
                  }
                })}
                onChange={(val: string) => {
                  let updated = cloneDeep(updatedFeatures)!
                  updated[index].value.value[innerIndex] = val
                  setUpdatedFeatures(updated)
                }}
              ></ChoiceSelect>
            )
          })}
        </div>
      )
    })

  const body = updatedFeatures && (
    <div className={`${roboto_condensed.className} p-2`}>{skillChoices}</div>
  )
  return (
    totalCount > 0 && (
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
  )
}
