import { Feature, SkillSelectionFeatureValue } from '@/models/db/feature'
import { CalculatedProficiency, SkillType } from '@/models/statistic'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Modal } from '../../base/modal'
import { ChoiceSelect } from '../../choice-select/choice-select'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { SkillIncrease } from './skill-increase'

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

export function SkillIncreaseModal({
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
      {name ? name : 'Skill Choices'} {setCount}/{totalCount}
    </button>
  )

  let counter = 0

  const skillChoices =
    updatedFeatures &&
    updatedFeatures.map((feature: Feature, index) => {
      const skillSelection = feature.value as SkillSelectionFeatureValue

      console.log(skillSelection)
      if (skillSelection.configuration.options !== 'Free') {
        return (
          <div
            key={`skillgroup-${index}`}
            className="inline-flex gap-2 mb-2 w-44"
          >
            <SkillIncrease
              options={skillSelection.configuration.options as SkillType[]}
              feature={feature}
            ></SkillIncrease>
          </div>
        )
      }
      return <></>
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
