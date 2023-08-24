import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { ChoiceSelect } from '@/components/choice-select/choice-select'
import { cloneDeep, toNumber } from 'lodash'
import { useContext } from 'react'

export function LevelSelect({
  onLevelChange,
}: {
  onLevelChange: (level: string) => void
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
      onChange={onLevelChange}
    ></ChoiceSelect>
  )
}
