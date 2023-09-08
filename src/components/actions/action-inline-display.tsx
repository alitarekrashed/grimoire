import { Action } from '@/models/db/action'
import { EntityModel } from '@/models/db/entity-model'
import { Feat } from '@/models/db/feat'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useContext, useEffect, useState } from 'react'
import { ActionRenderer } from '../activation-displays/action-renderer'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { PlayerCharacter } from '@/models/player-character'
import { PlayerCharacterContext } from '../character-display/player-character-context'

export function ActionInlineDisplay({
  actionName,
}: {
  actionName: string | Feat
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [action, setAction] = useState<Action>()

  const getAction = async (actionName: string | Feat) => {
    let action: Action = undefined!
    if (typeof actionName === 'string') {
      action = (await retrieveEntity(actionName, 'ACTION')) as Action
    } else {
      action = {
        description: actionName.description,
        _id: actionName._id,
        activation: actionName.activation!,
        name: actionName.name.toLowerCase(),
        source: actionName.source,
        saving_throw: actionName.saving_throw,
        entity_type: 'ACTION',
      }
    }
    return action
  }

  useEffect(() => {
    getAction(actionName).then((action) => {
      let description = action.description
      playerCharacter
        .getFeatModifications(action.name.toLowerCase())
        .forEach((val) => {
          description = description.concat(
            `<br/><br/><b>${val.name}</b><br/>${val.value}`
          )
        })
      action.description = description
      setAction(action)
    })
  }, [actionName])

  return (
    <>
      {action && (
        <Collapsible.Root defaultOpen={false}>
          <Collapsible.Trigger className="w-full flex justify-start rounded-sm bg-stone-300/40 hover:bg-stone-500/40">
            <span className="ml-1 mr-1">{action.name}</span>
            <ActionRenderer
              activation={action.activation}
              size={14}
            ></ActionRenderer>
          </Collapsible.Trigger>
          <Collapsible.Content className="overflow-hidden">
            {action.activation.trigger && (
              <div className="ml-1 mb-1">
                <span className="font-semibold">Trigger </span>
                <ParsedDescription
                  description={action.activation.trigger}
                ></ParsedDescription>
              </div>
            )}
            <div className="ml-1">
              <ParsedDescription
                description={action.description}
              ></ParsedDescription>
              {action.saving_throw && (
                <SavingThrowDisplay
                  value={action.saving_throw}
                ></SavingThrowDisplay>
              )}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  )
}
