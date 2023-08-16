import { ProficiencyRank } from '@/models/db/background'

export function SkillDisplay({
  name,
  rank,
  modifier,
  prefix,
}: {
  name: string
  rank: ProficiencyRank
  modifier: number
  prefix?: string
}) {
  return (
    <div className="flex">
      <span className="font-light text-[9px] rounded-full border border-b-stone-300 px-1 mr-1">
        {getRankSymbol(rank)}
      </span>
      <div className="pr-2 mr-auto">{`${
        prefix ? prefix + ': ' : ''
      }${name}`}</div>
      <div>{(modifier >= 0 ? ' +' : ' -') + modifier}</div>
    </div>
  )
}

function getRankSymbol(rank: ProficiencyRank) {
  switch (rank) {
    case 'untrained':
      return 'U'
    case 'trained':
      return 'T'
    case 'expert':
      return 'E'
  }
}
