import { PlayerCharacter } from '@/models/player-character'
import { CharacterSheetBox } from './character-sheet-box'
import { SavingThrowDisplay } from './proficiency-modifiers-column'

export function SavingThrowsDisplay({
  character,
}: {
  character: PlayerCharacter
}) {
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1">
        <div className="mb-1 font-semibold text-center">Saving Throws</div>
        {[...character.getSavingThrows().entries()].map((entry) => (
          <SavingThrowDisplay></SavingThrowDisplay>
        ))}
      </div>
    </CharacterSheetBox>
  )
}
