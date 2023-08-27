import { Action } from '@/models/db/action'
import { EntityModel } from '@/models/db/entity-model'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import { ActionRenderer } from '../activation-displays/action-renderer'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { TraitsList } from '../card/traits-list'
import { Spell } from '@/models/db/spell'

export function SpellInlineDisplay({ spellName }: { spellName: string }) {
  const [spell, setSpell] = useState<Spell>()

  useEffect(() => {
    retrieveEntity(spellName, 'SPELL').then((value: EntityModel) => {
      setSpell(value as Spell)
    })
  }, [spellName])

  return (
    <>
      {spell && (
        <Collapsible.Root defaultOpen={false}>
          <Collapsible.Trigger className="w-full flex justify-start rounded-sm bg-stone-300/40 hover:bg-stone-500/40">
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
      )}
    </>
  )
}
