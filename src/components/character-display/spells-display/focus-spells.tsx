import { Spell } from '@/models/db/spell'
import { useContext } from 'react'
import { SpellInlineDisplay } from '../../spells/spell-inline-display'
import { PlayerCharacterContext } from '../player-character-context'
import { SpellSlot } from './spell-slot'
import { cloneDeep } from 'lodash'
import { PlayerCharacter } from '@/models/player-character'

export function FocusSpells({ spells }: { spells: Spell[] }) {
  const {
    playerCharacter,
    updatePlayerCharacter,
    updateAndSavePlayerCharacter,
  } = useContext(PlayerCharacterContext)

  const focusPool: number = Math.min(spells.length, 3)

  const currentNumber =
    playerCharacter.getCharacter().player_state.focus_points.length

  const updated = cloneDeep(playerCharacter.getCharacter())

  if (currentNumber < focusPool) {
    const toAdd = focusPool - currentNumber
    for (let i = 0; i < toAdd; i++) {
      updated.player_state.focus_points.push(false)
    }
    PlayerCharacter.build(updated).then((val) => updatePlayerCharacter(val))
  } else if (currentNumber > focusPool) {
    let removalCounter = currentNumber - focusPool
    updated.player_state.focus_points.splice(
      updated.player_state.focus_points.length - removalCounter,
      removalCounter
    )
    PlayerCharacter.build(updated).then((val) => updatePlayerCharacter(val))
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
            <div key={`${spell}-${index}`} className="mb-1">
              <SpellInlineDisplay spell={spell}></SpellInlineDisplay>
            </div>
          ))}
      </span>
    </div>
  )
}
