import { ProficiencyRank } from '@/models/proficiency-rank'
import { HoverDisplay } from '../base/hover-display'
import { IoSparklesSharp } from 'react-icons/io5'
import { ParsedDescription } from '../parsed-description/parsed-description'

export function SkillDisplay({
  name,
  rank,
  modifier,
  value,
  prefix,
  additional,
}: {
  name: string
  rank: ProficiencyRank
  value?: number
  modifier?: number
  prefix?: string
  additional?: { description: string; name: string }[]
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
        <div className="pr-2 mr-auto">
          <div className="flex flex-row w-full items-center">
            <span className="mr-1">{`${
              prefix ? prefix + ': ' : ''
            }${name}`}</span>
            {getAdditionalDisplay(additional)}
          </div>
        </div>
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

function getAdditionalDisplay(
  additional: { description: string; name: string }[] | undefined
) {
  return (
    additional &&
    additional.length > 0 && (
      <HoverDisplay
        title={<IoSparklesSharp className="text-emerald-300" />}
        content={
          <div className="flex flex-col gap-1">
            {additional.map((value, index) => (
              <div key={index}>
                <span className="font-semibold">{value.name}: </span>
                <ParsedDescription
                  description={value.description}
                ></ParsedDescription>
              </div>
            ))}
          </div>
        }
      ></HoverDisplay>
    )
  )
}
