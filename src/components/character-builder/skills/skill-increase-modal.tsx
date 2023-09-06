import { OptionInlineIndicator } from '@/components/indicators/indicator'
import { Feature } from '@/models/db/feature'
import { SkillAttributes, SkillType } from '@/models/statistic'
import { roboto_condensed } from '@/utils/fonts'
import {
  SkillProficiencyManager,
  createManagerFromPlayerCharacter,
} from '@/utils/services/skill-proficiency-manager'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { Modal } from '../../base/modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { ProficiencyRank } from '@/models/proficiency-rank'

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
  const [updatedFeature, setUpdatedFeature] = useState<Feature>(
    cloneDeep(skillFeature)
  )
  const [manager, setManager] = useState<SkillProficiencyManager>(
    createManagerFromPlayerCharacter(playerCharacter, skillFeature)
  )

  useEffect(() => {
    setUpdatedFeature(cloneDeep(skillFeature))
    setManager(createManagerFromPlayerCharacter(playerCharacter, skillFeature))
  }, [skillFeature])

  useEffect(() => {
    setManager(createManagerFromPlayerCharacter(playerCharacter, skillFeature))
  }, [playerCharacter])

  let totalCount = skillFeature.value.value.length
  let setCount = updatedFeature.value.value.filter(
    (value: string) => value
  ).length

  const trigger = (
    <button
      className="border border-stone-300 rounded-md relative flex w-full h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      <div className="flex items-center">
        <span>
          {name ? name : 'Skill Choices'} {setCount}/{totalCount}
        </span>
        {setCount < totalCount && <OptionInlineIndicator />}
      </div>
    </button>
  )

  const options =
    updatedFeature.value.configuration.options !== 'Free'
      ? (updatedFeature.value.configuration.options as SkillType[])
      : Array.from(manager.getSkills().keys())

  const skillSelection = (
    <div className="inline-flex gap-2 mb-2 w-full">
      <div className="w-full">
        <div className="grid grid-cols-4 gap-2 w-full">
          {options.map((val: string, index: number) => {
            // TODO ALI if a item is selected AND disabled, it likely means that some other feature
            // is increasing the proficiency later on not sure if we should handle this differently
            // (i.e. remove the 'disabled' attribute, or if we should have some third state)
            const isSelected: boolean = updatedFeature.value.value.includes(val)
            const isDisabled: boolean = ProficiencyRank.isGreaterThanOrEqualTo(
              manager.getSkills().get(val)!.rank,
              ProficiencyRank.get(updatedFeature.value.configuration.max_rank)
            )
              ? true
              : isSelected === false &&
                setCount === updatedFeature.value.value.length
            return (
              <div
                className="col-span-1 inline-flex items-center justify-between"
                key={val}
              >
                <button
                  className="rounded-md border border-stone-300 w-full hover:bg-violet-700/50 hover:border-violet-500/50 hover:data-[selected=true]:bg-violet-700/50 hover:data-[selected=true]:border-stone-300/50 hover:data-[selected=true]:text-stone-300/50 data-[selected=true]:bg-violet-700 data-[selected=true]:text-violet-200 data-[selected=true]:border-violet-900 data-[disabled=true]:bg-stone-800/20 data-[disabled=true]:text-stone-600/75 data-[disabled=true]:border-stone-600/50 "
                  data-value={val}
                  data-selected={isSelected}
                  data-disabled={isDisabled}
                  onClick={(e) => {
                    if (isSelected || isDisabled === false) {
                      const updated: Feature = cloneDeep(updatedFeature)
                      if (!isSelected) {
                        const index: number = updated.value.value.findIndex(
                          (skill: string) => !skill
                        )
                        updated.value.value[index] = ((
                          e.currentTarget as HTMLElement
                        ).dataset.value as SkillType)!
                      } else {
                        const index: number = updated.value.value.indexOf(val)
                        updated.value.value[index] = null
                      }
                      setUpdatedFeature(updated)
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {SkillAttributes.has(val as SkillType) === false &&
                        'Lore: '}
                      {val}
                      {isSelected && (
                        <FaCheck className="absolute top-1 right-[-25px]" />
                      )}
                    </div>
                    <span>
                      <span className="text-xs">
                        {isSelected
                          ? manager
                              .getSkills()
                              .get(val)!
                              .rank.getNext()
                              .getName()
                          : manager.getSkills().get(val)!.rank.getName()}
                      </span>
                    </span>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const body = (
    <div className={`${roboto_condensed.className} p-2`}>{skillSelection}</div>
  )

  return (
    totalCount > 0 && (
      <Modal
        size="medium"
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
              setUpdatedFeature(skillFeature)
              onSkillsUpdate(skillFeature)
            },
          },
        ]}
      ></Modal>
    )
  )
}
