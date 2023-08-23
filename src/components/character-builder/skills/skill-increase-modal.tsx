import { Feature, SkillSelectionFeatureValue } from '@/models/db/feature'
import {
  CalculatedProficiency,
  SkillAttributes,
  SkillType,
} from '@/models/statistic'
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
  skillFeature,
  onSkillsUpdate,
}: {
  name?: string
  skillFeature: Feature
  onSkillsUpdate: (feature: Feature) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [proficiencies, setProficiencies] = useState<
    Map<SkillType, CalculatedProficiency>
  >(playerCharacter.getSkills([skillFeature]))
  const [updatedFeature, setUpdatedFeature] = useState<Feature>(
    cloneDeep(skillFeature)
  )
  const [choices, setChoices] = useState<string[]>([])

  useEffect(() => {
    setChoices(getSkillChoices(proficiencies))
  }, [proficiencies])

  useEffect(() => {
    setUpdatedFeature(cloneDeep(skillFeature))
    setProficiencies(playerCharacter.getSkills([skillFeature]))
  }, [skillFeature])

  let totalCount = skillFeature.value.value.length
  let setCount = skillFeature.value.value.filter(
    (value: string) => value
  ).length

  const trigger = (
    <button
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      {name ? name : 'Skill Choices'} {setCount}/{totalCount}
    </button>
  )

  const skillSelection =
    updatedFeature.value.configuration.options !== 'Free' ? (
      <div className="inline-flex gap-2 mb-2 w-full">
        <SkillIncrease
          options={updatedFeature.value.configuration.options as SkillType[]}
          feature={updatedFeature}
          onChange={(feature: Feature) => setUpdatedFeature(feature)}
        ></SkillIncrease>
      </div>
    ) : (
      <div className="inline-flex gap-2 mb-2 w-full">
        <SkillIncrease
          options={Array.from(SkillAttributes.keys())}
          feature={updatedFeature}
          onChange={(feature: Feature) => setUpdatedFeature(feature)}
        ></SkillIncrease>
      </div>
    )

  const body = (
    <div className={`${roboto_condensed.className} p-2`}>{skillSelection}</div>
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
              onSkillsUpdate(updatedFeature!)
            },
          },
          {
            label: 'Cancel',
            onClick: () => {
              onSkillsUpdate(skillFeature)
            },
          },
        ]}
      ></Modal>
    )
  )
}
