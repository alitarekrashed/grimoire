import { PlayerCharacter } from '@/models/player-character'
import { SkillDisplay } from './skill-display'
import { CharacterSheetBox } from './character-sheet-box'

export function SavingThrowsDisplay({
  character,
}: {
  character: PlayerCharacter
}) {
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1">
        <div className="mb-1 font-semibold">Saving Throws</div>
        {[...character.getSavingThrows().entries()].map((entry) => (
          <SkillDisplay
            key={entry[0]}
            name={entry[0]}
            rank={entry[1].rank}
            modifier={entry[1].modifier}
          ></SkillDisplay>
        ))}
      </div>
    </CharacterSheetBox>
  )
}
