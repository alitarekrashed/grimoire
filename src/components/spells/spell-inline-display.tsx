import { Spell } from '@/models/db/spell'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useContext, useEffect, useState } from 'react'
import { ActionRenderer } from '../activation-displays/action-renderer'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { TraitsList } from '../card/traits-list'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { Button } from '../base/button'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import React from 'react'

export function SpellInlineDisplay({
  spell,
  castDisabled,
  onCast,
}: {
  spell: Spell
  castDisabled?: boolean
  onCast?: () => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [disabled, setDisabled] = useState<boolean>(false)

  useEffect(() => {
    setDisabled(castDisabled!)
  }, [castDisabled])
  return (
    <>
      {spell && (
        <div className="flex flex-row gap-2 items-center relative">
          {onCast && (
            <>
              <Button
                className="absolute top-0 flew-grow-0 py-0.5"
                label="CAST"
                disabled={disabled}
                onClick={onCast}
              />
              <div className="mr-12"></div>
            </>
          )}
          <div className="flex-1">
            <Collapsible.Root defaultOpen={false}>
              <Collapsible.Trigger className="w-full py-0.5 flex justify-start rounded-sm bg-stone-300/40 hover:bg-stone-500/40">
                <span className="flex-0 ml-1 mr-1">{spell.name}</span>
                <span className="flex-1 text-start">
                  <ActionRenderer
                    activation={spell.activation}
                    size={14}
                  ></ActionRenderer>
                </span>
                <span className="font-bold flex-0 mr-2">
                  <span className="mr-1">{getType(spell)}</span>
                  {spell.focus || spell.rank === 0
                    ? Math.ceil(playerCharacter.getCharacter().level / 2)
                    : spell.rank}
                </span>
              </Collapsible.Trigger>
              <Collapsible.Content className="overflow-hidden">
                <div className="my-1">
                  <TraitsList
                    traits={spell.traits}
                    rarity={spell.rarity}
                  ></TraitsList>
                </div>
                {spell.activation.trigger && (
                  <div className="ml-1 mb-1">
                    <span className="font-semibold">Trigger </span>
                    <ParsedDescription
                      description={spell.activation.trigger}
                    ></ParsedDescription>
                  </div>
                )}
                <div className="ml-1">
                  <ParsedDescription
                    description={spell.description}
                  ></ParsedDescription>
                  {spell.saving_throw && (
                    <SavingThrowDisplay
                      value={spell.saving_throw}
                    ></SavingThrowDisplay>
                  )}
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        </div>
      )}
    </>
  )
}

function getType(spell: Spell) {
  if (spell.focus) {
    return 'Focus'
  }
  return spell.rank === 0 ? 'Cantrip' : 'Spell'
}
