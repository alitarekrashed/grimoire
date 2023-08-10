import { Action } from '@/models/db/action'
import { EntityModel } from '@/models/db/entity-model'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import styles from './action-inline-display.module.css'
import { ActionRenderer } from '../activation-displays/action-renderer'
import { Feat } from '@/models/db/feat'
import { ParsedDescription } from '../parsed-description/parsed-description'

export function ActionInlineDisplay({
  actionName,
}: {
  actionName: string | Feat
}) {
  const [action, setAction] = useState<Action>()

  useEffect(() => {
    if (typeof actionName === 'string') {
      retrieveEntity(actionName, 'ACTION').then((value: EntityModel) => {
        setAction(value as Action)
      })
    } else {
      // TODO this is a stop gap, really i need a smarter way to render Feat Actions vs regular actions...
      setAction({
        description: actionName.description,
        _id: actionName._id,
        activation: actionName.activation!,
        name: actionName.name.toLowerCase(),
        source: actionName.source,
        entity_type: 'ACTION',
      })
    }
  }, [actionName])

  return (
    <>
      {action && (
        <Collapsible.Root defaultOpen={false}>
          <Collapsible.Trigger className="w-full flex justify-start hover:bg-stone-300/40 hover:rounded-sm">
            <span className="ml-1 mr-1">{action.name}</span>
            <ActionRenderer
              activation={action.activation}
              size={14}
            ></ActionRenderer>
          </Collapsible.Trigger>
          <Collapsible.Content className={`${styles.actionDescription}`}>
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
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  )
}
