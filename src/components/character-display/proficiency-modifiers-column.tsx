import { PlayerCharacter } from '@/models/player-character'
import { CharacterSheetBox } from './character-sheet-box'
import { SkillDisplay } from './skill-display'
import { useContext } from 'react'
import { PlayerCharacterContext } from './player-character-context'
import { SkillAttributes, SkillType } from '@/models/statistic'

export function ProficiencyModifiersColumn() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  return (
    playerCharacter && (
      <div className="grid grid-rows-4 gap-1 h-full">
        <div className="row-span-1">
          <div className="mb-1">
            <PerceptionAndClassDCDisplay
              character={playerCharacter}
            ></PerceptionAndClassDCDisplay>
          </div>
          <div className="">
            <SavingThrowsDisplay
              character={playerCharacter}
            ></SavingThrowsDisplay>
          </div>
        </div>
        <div className="row-span-3">
          <SkillsDisplay character={playerCharacter}></SkillsDisplay>
        </div>
      </div>
    )
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
          value={10 + character.getClassDC().modifier}
        ></SkillDisplay>
      </div>
    </CharacterSheetBox>
  )
}

function SavingThrowsDisplay({ character }: { character: PlayerCharacter }) {
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1">
        <div className="mb-1 font-semibold text-center">Saving Throws</div>
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
        <div className="mb-1 font-semibold text-center">Skills</div>
        {[...character.getSkillProfciencyManager().getSkills().entries()].map(
          (entry) => (
            <SkillDisplay
              key={entry[0]}
              name={entry[0]}
              rank={entry[1].rank}
              modifier={entry[1].modifier}
              prefix={
                SkillAttributes.has(entry[0] as SkillType) === false
                  ? 'Lore'
                  : undefined
              }
            ></SkillDisplay>
          )
        )}
      </div>
    </CharacterSheetBox>
  )
}
