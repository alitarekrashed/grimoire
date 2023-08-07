import { Action } from '@/models/db/action'
import { EntityModel } from '@/models/db/entity-model'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import { useEffect, useState } from 'react'
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
        <div>
          <span className="mr-1">{action.name}</span>
          <ActionRenderer
            activation={action.activation}
            size={14}
          ></ActionRenderer>
        </div>
      )}
    </>
  )
}
