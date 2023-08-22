import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { ProficiencyRank } from '@/models/db/background'
import { Feature } from '@/models/db/feature'
import { CalculatedProficiency, SkillType } from '@/models/statistic'
import { isGreaterThanOrEqualTo } from '@/utils/services/gear-proficiency-manager'
import { cloneDeep } from 'lodash'
import { useContext, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

export function SkillIncrease({
  options,
  feature,
  onChange,
}: {
  options: SkillType[]
  feature: Feature
  onChange: (feature: Feature) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [proficiencies, setProficiencies] = useState<
    Map<SkillType, CalculatedProficiency>
  >(playerCharacter.getSkills([feature]))
  const [updatedFeature, setUpdatedFeature] = useState<Feature>(feature)

  let setCount = feature.value.value.filter((value: string) => value).length

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2 grid-rows-4 w-full">
        {options.map((val: SkillType, index: number) => {
          const isSelected: boolean = updatedFeature.value.value.includes(val)
          const isDisabled: boolean = isGreaterThanOrEqualTo(
            proficiencies.get(val)!.rank,
            feature.value.configuration.max_rank
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
                    onChange(updated)
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
                        ? getNextRank(proficiencies.get(val)!.rank)
                        : proficiencies.get(val)!.rank}
                    </span>
                  </span>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getNextRank(rank: ProficiencyRank) {
  switch (rank) {
    case 'untrained':
      return 'trained'
    case 'trained':
      return 'expert'
  }
}
