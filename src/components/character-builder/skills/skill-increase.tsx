import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { ProficiencyRank } from '@/models/db/background'
import { Feature } from '@/models/db/feature'
import { SkillType } from '@/models/statistic'
import { useContext, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export function SkillIncrease({
  options,
  feature,
}: {
  options: SkillType[]
  feature: Feature
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [proficiencies, setProficiencies] = useState<
    Map<SkillType, CalculatedProficiency>
  >(playerCharacter.getSkills([feature]))
  const [updatedFeature, setUpdatedFeature] = useState<Feature>(feature)

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        {options.map((val: SkillType) => (
          <div className="inline-flex items-center justify-between" key={val}>
            <button className="rounded-md p-1 border border-stone-300 hover:bg-stone-500">
              <FaChevronLeft size={10} />
            </button>
            <div className="flex flex-col items-center">
              <span>{val}</span>
              <span>
                <span className="text-xs">
                  {updatedFeature.value.value.includes(val)
                    ? getNextRank(proficiencies.get(val).rank)
                    : proficiencies.get(val).rank}
                </span>
              </span>
            </div>
            <button className="rounded-md p-1 border border-stone-300 hover:bg-stone-500">
              <FaChevronRight size={10} />
            </button>
          </div>
        ))}
      </div>
      <div>{feature.value.value}</div>
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
