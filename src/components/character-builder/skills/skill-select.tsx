import { Feature, SkillSelectionFeatureValue } from '@/models/db/feature'
import { CalculatedProficiency, SkillType } from '@/models/statistic'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { ChoiceSelect } from '../../choice-select/choice-select'

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

export function SkillSelect({
  skillFeature,
  onSkillsUpdate,
}: {
  skillFeature: Feature
  onSkillsUpdate: (features: Feature[]) => void
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

  const skillSelection = updatedFeature.value as SkillSelectionFeatureValue
  const value: string = skillSelection.value[0]

  return (
    <ChoiceSelect
      value={value}
      title={skillFeature.name ?? ''}
      options={choices.filter((choice: string) => {
        if (choice === value) {
          return true
        }
        const alreadyChosen = updatedFeature.value.value.some(
          (skills: string[]) => {
            return skills && skills.includes(choice)
          }
        )
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
        let updated = cloneDeep(updatedFeature)!
        updated.value.value[0] = val
        onSkillsUpdate([updated])
      }}
    ></ChoiceSelect>
  )
}
