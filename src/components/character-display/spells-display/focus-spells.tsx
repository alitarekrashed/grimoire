import { CharacterEntity } from '@/models/db/character-entity'
import { Spell } from '@/models/db/spell'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { SpellInlineDisplay } from '../../spells/spell-inline-display'
import { PlayerCharacterContext } from '../player-character-context'
import { RefocusButton } from './refocus-button'
import { SpellSlot } from './spell-slot'
import { Separator } from '@/components/base/separator'

export function FocusSpells({ spells }: { spells: Spell[] }) {
  const { playerCharacter, updateAndSaveCharacterEntity } = useContext(
    PlayerCharacterContext
  )

  const [character, setCharacter] = useState<CharacterEntity>(
    playerCharacter.getCharacter()
  )

  useEffect(() => {
    setCharacter(playerCharacter.getCharacter())
  }, [playerCharacter])

  reconcileFocusPoints(spells, character, updateAndSaveCharacterEntity)

  const handleCast = () => {
    for (let i = 0; i < character.player_state.focus_points.length; i++) {
      if (character.player_state.focus_points[i] === false) {
        const updated = cloneDeep(character)
        updated.player_state.focus_points[i] = true
        updateAndSaveCharacterEntity(updated)
        break
      }
    }
  }

  const handleRefocus = () => {
    const updated = cloneDeep(character)
    for (let i = 0; i < character.player_state.focus_points.length; i++) {
      updated.player_state.focus_points[i] = false
    }
    updateAndSaveCharacterEntity(updated)
  }

  return (
    <div>
      <div className="text-lg font-light flex flex-row gap-2 items-center mb-1">
        Focus
        <div className="flex flex-row flex-1 gap-1">
          {character.player_state.focus_points.map((value, index) => (
            <SpellSlot
              key={index}
              initial={character.player_state.focus_points[index]}
              onClick={(checked: boolean) => {
                const updated = cloneDeep(character)
                updated.player_state.focus_points[index] = checked
                updateAndSaveCharacterEntity(updated)
              }}
            ></SpellSlot>
          ))}
        </div>
        <RefocusButton
          disabled={character.player_state.focus_points.every((val) => !val)}
          onClick={handleRefocus}
        ></RefocusButton>
      </div>
      <Separator className="my-2"></Separator>
      <span className="text-xs">
        {spells &&
          spells.length > 0 &&
          spells.map((spell, index) => (
            <div key={`${spell}-${index}`} className="mb-3">
              <SpellInlineDisplay
                spell={spell}
                castDisabled={character.player_state.focus_points.every(
                  (val) => val
                )}
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
  updateAndSaveCharacterEntity: (val: CharacterEntity) => void
) {
  const focusPool: number = Math.min(focusSpells.length, 3)

  const currentNumber = characterEntity.player_state.focus_points.length

  const updated = cloneDeep(characterEntity)

  if (currentNumber < focusPool) {
    const toAdd = focusPool - currentNumber
    for (let i = 0; i < toAdd; i++) {
      updated.player_state.focus_points.push(false)
    }
    updateAndSaveCharacterEntity(updated)
  } else if (currentNumber > focusPool) {
    let removalCounter = currentNumber - focusPool
    updated.player_state.focus_points.splice(
      updated.player_state.focus_points.length - removalCounter,
      removalCounter
    )
    updateAndSaveCharacterEntity(updated)
  }
}
