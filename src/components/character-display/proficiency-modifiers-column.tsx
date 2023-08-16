import { PlayerCharacter } from '@/models/player-character'
import { CharacterSheetBox } from './character-sheet-box'
import { SkillDisplay } from './skill-display'

export function ProficiencyModifiersColumn({
  character,
}: {
  character: PlayerCharacter
}) {
  return (
    <>
      <div className="mt-2 mb-2">
        <PerceptionAndClassDCDisplay
          character={character}
        ></PerceptionAndClassDCDisplay>
      </div>
      <div className="mb-2">
        <SavingThrowsDisplay character={character}></SavingThrowsDisplay>
      </div>
      <SkillsDisplay character={character}></SkillsDisplay>
    </>
  )
}

function PerceptionAndClassDCDisplay({
  character,
}: {
  character: PlayerCharacter
}) {
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1">
        <SkillDisplay
          name="Perception"
          rank={character.getPerception().rank}
          modifier={character.getPerception().modifier}
        ></SkillDisplay>
        <SkillDisplay
          name="Class DC"
          rank={character.getClassDC().rank}
          modifier={character.getClassDC().modifier}
        ></SkillDisplay>
      </div>
    </CharacterSheetBox>
  )
}

function SavingThrowsDisplay({ character }: { character: PlayerCharacter }) {
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

function SkillsDisplay({ character }: { character: PlayerCharacter }) {
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
