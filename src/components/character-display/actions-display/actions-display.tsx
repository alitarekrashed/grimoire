import { ActionInlineDisplay } from '@/components/actions/action-inline-display'
import { Action } from '@/models/db/action'
import { Feat } from '@/models/db/feat'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../player-character-context'

export function ActionDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    getActions(
      playerCharacter.getActions().map((val) => val.feature.value)
    ).then((result: Action[]) => {
      setActions(result)
    })
  }, [])

  return (
    <div>
      <div className="mb-2">
        <Filters actions={actions}></Filters>
      </div>
      <span className="text-xs">
        {actions.map((action, index) => (
          <div key={`${action}-${index}`} className="mb-1">
            <ActionInlineDisplay initial={action}></ActionInlineDisplay>
          </div>
        ))}
      </span>
    </div>
  )
}

function Filters({ actions }: { actions: Action[] }) {
  const filters = [
    'Augment',
    'Debilitate',
    'Defensive',
    'Downtime',
    'Encounter',
    'Healing',
    'Interaction',
    'Movement',
    'Offensive',
    'Support',
  ]

  return (
    <div className={`flex flex-col gap-1`}>
      <div className="flex flex-row flex-wrap gap-1">
        {filters.map((value: string) => (
          <button
            key={value}
            className="flex flex-row gap-1 border p-1 rounded-md"
          >
            <span>{value}</span>
          </button>
        ))}
      </div>
    </div>
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
