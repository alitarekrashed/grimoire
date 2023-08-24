import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { ChoiceSelect } from '@/components/choice-select/choice-select'
import { CharacterEntity } from '@/models/db/character-entity'
import { toNumber } from 'lodash'
import { useContext } from 'react'

export function LevelSelect({
  onUpdate,
}: {
  onUpdate: (updateFunction: (cloned: CharacterEntity) => void) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const values = []
  for (let i = 1; i <= 20; i++) {
    values.push(`${i}`)
  }

  return (
    <ChoiceSelect
      value={playerCharacter.getCharacter().level.toString()}
      title="Level"
      options={values}
      onChange={(val: string) => {
        onUpdate(
          (character: CharacterEntity) => (character.level = toNumber(val))
        )
      }}
    ></ChoiceSelect>
  )
}
