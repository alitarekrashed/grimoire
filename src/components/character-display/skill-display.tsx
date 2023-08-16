import { ProficiencyRank } from '@/models/db/background'

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
  switch (rank) {
    case 'untrained':
      return { symbol: 'U', color: '' }
    case 'trained':
      return { symbol: 'T', color: 'bg-stone-400/50' }
    case 'expert':
      return { symbol: 'E', color: 'bg-green-400/50' }
  }
}
