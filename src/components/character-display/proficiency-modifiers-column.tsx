import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { CharacterSheetBox } from './character-sheet-box'
import { SkillDisplay } from './skill-display'
import { useContext } from 'react'
import { PlayerCharacterContext } from './player-character-context'
import {
  CalculatedProficiency,
  SavingThrowType,
  SkillAttributes,
  SkillType,
} from '@/models/statistic'

export function ProficiencyModifiersColumn() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  return (
    playerCharacter && (
      <div className="grid grid-rows-8 gap-1 h-full">
        <div className="row-span-3 flex flex-col">
          <div className="mb-1">
            <PerceptionAndClassDCDisplay
              character={playerCharacter}
            ></PerceptionAndClassDCDisplay>
          </div>
          <div className="flex-1">
            <SavingThrowsDisplay
              character={playerCharacter}
            ></SavingThrowsDisplay>
          </div>
        </div>
        <div className="row-span-5">
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
          additional={character
            .getResolvedFeatures()
            .filter(
              (value) =>
                value.feature.type === 'MODIFIER' &&
                value.feature.value.type === 'Perception'
            )
            .map((value) => {
              const modifier = value.feature.value.modifier.value
              console.log(value)
              return {
                description: `${modifier >= 0 ? '+' : '-'}${modifier} (${
                  value.feature.value.modifier.type
                }) ${value.feature.value.condition}`,
                name: value.source,
              }
            })}
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
  const savingThrowModifiers = character
    .getResolvedFeatures()
    .filter((value) => value.feature.type === 'SAVING_THROW_MODIFIER')
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1">
        <div className="mb-1 font-semibold text-center">Saving Throws</div>
        {[...character.getSavingThrows().entries()].map((entry) => (
          <div key={entry[0]}>
            <SavingThrowDisplay
              entry={entry}
              modifiers={savingThrowModifiers
                .filter((value) => value.feature.value.type.includes(entry[0]))
                .map((value) => value.feature.value)}
            ></SavingThrowDisplay>
          </div>
        ))}
      </div>
    </CharacterSheetBox>
  )
}

function SavingThrowDisplay({
  entry,
  modifiers,
}: {
  entry: [SavingThrowType, CalculatedProficiency]
  modifiers: { description: string; name: string }[]
}) {
  return (
    <SkillDisplay
      name={entry[0]}
      rank={entry[1].rank}
      modifier={entry[1].modifier}
      additional={modifiers}
    ></SkillDisplay>
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
