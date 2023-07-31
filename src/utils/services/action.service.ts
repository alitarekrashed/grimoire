import { Action } from '@/models/db/action'

export function retrieveAction(key: string): Promise<Action> {
  return (async () => {
    const actions = await (
      await fetch(`http://localhost:3000/api/actions?name=${key}`)
    ).json()
    return actions.length > 0 ? actions[0] : undefined
  })()
}
