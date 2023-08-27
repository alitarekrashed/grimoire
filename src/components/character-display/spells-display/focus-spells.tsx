import { CharacterEntity } from '@/models/db/character-entity'
import { Spell } from '@/models/db/spell'
import { PlayerCharacter } from '@/models/player-character'
import { cloneDeep } from 'lodash'
import { useContext } from 'react'
import { SpellInlineDisplay } from '../../spells/spell-inline-display'
import { PlayerCharacterContext } from '../player-character-context'
import { SpellSlot } from './spell-slot'

export function FocusSpells({ spells }: { spells: Spell[] }) {
  const { playerCharacter, updateAndSavePlayerCharacter } = useContext(
    PlayerCharacterContext
  )

  reconcileFocusPoints(
    spells,
    playerCharacter.getCharacter(),
    updateAndSavePlayerCharacter
  )

  const handleCast = () => {
    for (
      let i = 0;
      i < playerCharacter.getCharacter().player_state.focus_points.length;
      i++
    ) {
      if (
        playerCharacter.getCharacter().player_state.focus_points[i] === false
      ) {
        const updated = cloneDeep(playerCharacter.getCharacter())
        updated.player_state.focus_points[i] = true
        PlayerCharacter.build(updated).then((val) =>
          updateAndSavePlayerCharacter(val)
        )
        break
      }
    }
  }

  return (
    <div>
      <div className="text-lg font-light flex flex-row gap-2 items-center">
        Focus
        <div className="flex flex-row gap-1">
          {playerCharacter
            .getCharacter()
            .player_state.focus_points.map((value, index) => (
              <SpellSlot
                key={index}
                initial={
                  playerCharacter.getCharacter().player_state.focus_points[
                    index
                  ]
                }
                onClick={(checked: boolean) => {
                  const updated = cloneDeep(playerCharacter.getCharacter())
                  updated.player_state.focus_points[index] = checked
                  PlayerCharacter.build(updated).then((val) =>
                    updateAndSavePlayerCharacter(val)
                  )
                }}
              ></SpellSlot>
            ))}
        </div>
      </div>
      <span className="text-xs">
        {spells &&
          spells.length > 0 &&
          spells.map((spell, index) => (
            <div key={`${spell}-${index}`} className="mb-3">
              <SpellInlineDisplay
                spell={spell}
                onCast={handleCast}
              ></SpellInlineDisplay>
            </div>
          ))}
      </span>
    </div>
  )
}

function reconcileFocusPoints(
  focusSpells: Spell[],
  characterEntity: CharacterEntity,
  updateAndSavePlayerCharacter: (val: PlayerCharacter) => void
) {
  const focusPool: number = Math.min(focusSpells.length, 3)

  const currentNumber = characterEntity.player_state.focus_points.length

  const updated = cloneDeep(characterEntity)

  if (currentNumber < focusPool) {
    const toAdd = focusPool - currentNumber
    for (let i = 0; i < toAdd; i++) {
      updated.player_state.focus_points.push(false)
    }
    PlayerCharacter.build(updated).then((val) =>
      updateAndSavePlayerCharacter(val)
    )
  } else if (currentNumber > focusPool) {
    let removalCounter = currentNumber - focusPool
    updated.player_state.focus_points.splice(
      updated.player_state.focus_points.length - removalCounter,
      removalCounter
    )
    PlayerCharacter.build(updated).then((val) =>
      updateAndSavePlayerCharacter(val)
    )
  }
}
