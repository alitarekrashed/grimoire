import { PlayerCharacter } from '@/models/player-character'
import { CharacterSheetBox } from './character-sheet-box'
import { SkillDisplay } from './skill-display'

export function SkillsDisplay({ character }: { character: PlayerCharacter }) {
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1">
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
    </CharacterSheetBox>
  )
}
