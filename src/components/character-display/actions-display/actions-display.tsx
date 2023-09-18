import { Action } from '@/models/db/action'
import { Feat } from '@/models/db/feat'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import { ActionInlineDisplay } from '@/components/actions/action-inline-display'

export function ActionDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    getActions(
      playerCharacter.getActions().map((val) => val.feature.value)
    ).then((result: Action[]) => setActions(result))
  }, [playerCharacter.getActions()])

  return (
    <span className="text-xs">
      {actions.map((action, index) => (
        <div key={`${action}-${index}`} className="mb-1">
          <ActionInlineDisplay initial={action}></ActionInlineDisplay>
        </div>
      ))}
    </span>
  )
}

const getActions = async (actions: (string | Feat)[]): Promise<Actionp[]> => {
  const result = []

  for (let i = 0; i < actions.length; i++) {
    result.push(await getAction(actions[i]))
  }
  result.sort((a, b) => a.name.localeCompare(b.name))
  return result
}

const getAction = async (actionName: string | Feat) => {
  let action: Action = undefined!
  if (typeof actionName === 'string') {
    action = (await retrieveEntity(actionName, 'ACTION')) as Action
  } else {
    action = {
      description: actionName.description,
      _id: actionName._id,
      activation: actionName.activation!,
      traits: actionName.traits,
      name: actionName.name.toLowerCase(),
      source: actionName.source,
      saving_throw: actionName.saving_throw,
      entity_type: 'ACTION',
    }
  }
  return action
}
