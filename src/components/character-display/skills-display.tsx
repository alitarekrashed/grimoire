import { ProficiencyRank } from '@/models/db/background'
import { PlayerCharacter } from '@/models/player-character'

export function SkillsDisplay({ character }: { character: PlayerCharacter }) {
  return (
    <div className="flex flex-col text-xs w-fit text-center gap-1 m-2 p-2 rounded-md border border-b-stone-300 bg-stone-800">
      <div className="mb-1 font-semibold">Skills</div>
      {[...character.getSkills().entries()].map((entry) => (
        <SkillDisplay
          key={entry[0]}
          name={entry[0]}
          rank={entry[1].rank}
          modifier={entry[1].modifier}
        ></SkillDisplay>
      ))}
      {[...character.getLores().entries()].map((entry) => (
        <SkillDisplay
          key={entry[0]}
          name={entry[0]}
          rank={entry[1].rank}
          modifier={entry[1].modifier}
          prefix="Lore"
        ></SkillDisplay>
      ))}
    </div>
  )
}

function SkillDisplay({
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
