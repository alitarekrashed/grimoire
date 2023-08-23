import { Feature } from '@/models/db/feature'
import { SkillAttributes, SkillType } from '@/models/statistic'
import { roboto_condensed } from '@/utils/fonts'
import { isGreaterThanOrEqualTo } from '@/utils/services/gear-proficiency-manager'
import {
  SkillProficiencyManager,
  createManagerForCharacter,
  getNextRank,
} from '@/utils/services/skill-proficiency-manager'
import { clone, cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { Modal } from '../../base/modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'

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
    createManagerForCharacter(playerCharacter, skillFeature)
  )

  useEffect(() => {
    setUpdatedFeature(cloneDeep(skillFeature))
    setManager(createManagerForCharacter(playerCharacter, skillFeature))
  }, [skillFeature])

  let totalCount = skillFeature.value.value.length
  let setCount = updatedFeature.value.value.filter(
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

  const options =
    updatedFeature.value.configuration.options !== 'Free'
      ? (updatedFeature.value.configuration.options as SkillType[])
      : Array.from(SkillAttributes.keys())

  const skillSelection = (
    <div className="inline-flex gap-2 mb-2 w-full">
      <div className="w-full">
        <div className="grid grid-cols-4 gap-2 grid-rows-4 w-full">
          {options.map((val: SkillType, index: number) => {
            const isSelected: boolean = updatedFeature.value.value.includes(val)
            const isDisabled: boolean = isGreaterThanOrEqualTo(
              manager.getSkills().get(val)!.rank,
              updatedFeature.value.configuration.max_rank
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
                    if (isDisabled === false) {
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
                      {val}
                      {isSelected && (
                        <FaCheck className="absolute top-1 right-[-25px]" />
                      )}
                    </div>

                    <span>
                      <span className="text-xs">
                        {isSelected
                          ? getNextRank(manager.getSkills().get(val)!.rank)
                          : manager.getSkills().get(val)!.rank}
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
