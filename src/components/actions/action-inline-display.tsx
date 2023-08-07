import { Action } from '@/models/db/action'
import { EntityModel } from '@/models/db/entity-model'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import styles from './action-inline-display.module.css'
import { ActionRenderer } from '../activation-displays/action-renderer'

export function ActionInlineDisplay({ actionName }: { actionName: string }) {
  const [action, setAction] = useState<Action>()

  useEffect(() => {
    retrieveEntity(actionName, 'ACTION').then((value: EntityModel) => {
      setAction(value as Action)
    })
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
            <div className="ml-1">{action.description}</div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  )
}
