import { ProficiencyRank } from '@/models/proficiency-rank'

export function SkillDisplay({
  name,
  rank,
  modifier,
  value,
  prefix,
}: {
  name: string
  rank: ProficiencyRank
  value?: number
  modifier?: number
  prefix?: string
}) {
  const rankDisplay = getRankDisplay(rank)
  return (
    <div className="flex ">
      <span
        className={`font-light text-[9px] rounded-full border border-b-stone-300 px-1 mr-1 ${rankDisplay.color}`}
      >
        {rankDisplay.symbol}
      </span>
      <div className="flex hover:text-rose-400 w-full">
        <div className="pr-2 mr-auto">{`${
          prefix ? prefix + ': ' : ''
        }${name}`}</div>
        {value && <div>{value}</div>}
        {modifier && <div>{(modifier >= 0 ? ' +' : ' -') + modifier}</div>}
      </div>
    </div>
  )
}

function getRankDisplay(rank: ProficiencyRank): {
  symbol: string
  color: string
} {
  switch (rank.getName()) {
    case 'untrained':
      return { symbol: 'U', color: '' }
    case 'trained':
      return { symbol: 'T', color: 'bg-stone-400/50' }
    case 'expert':
      return { symbol: 'E', color: 'bg-green-400/50' }
    case 'master':
      return { symbol: 'M', color: 'bg-purple-400/50' }
    case 'legendary':
      return { symbol: 'L', color: 'bg-orange-400/50' }
    default:
      return { symbol: 'N/A', color: 'bg-red-400/50' }
  }
}
