import { Spell } from '@/models/db/spell'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import { ActionRenderer } from '../activation-displays/action-renderer'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { TraitsList } from '../card/traits-list'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { Button } from '../base/button'

export function SpellInlineDisplay({
  spell,
  castDisabled,
  onCast,
}: {
  spell: Spell
  castDisabled?: boolean
  onCast: () => void
}) {
  const [disabled, setDisabled] = useState<boolean>(false)

  useEffect(() => {
    setDisabled(castDisabled!)
  }, [castDisabled])
  return (
    <>
      {spell && (
        <div className="flex flex-row gap-2 items-center relative">
          <Button
            className="absolute top-0 flew-grow-0 py-0.5"
            label="CAST"
            disabled={disabled}
            onClick={onCast}
          />
          <div className="flex-1 ml-12">
            <Collapsible.Root defaultOpen={false}>
              <Collapsible.Trigger className="w-full py-0.5 flex justify-start rounded-sm bg-stone-300/40 hover:bg-stone-500/40">
                <span className="ml-1 mr-1">{spell.name}</span>
                <ActionRenderer
                  activation={spell.activation}
                  size={14}
                ></ActionRenderer>
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
