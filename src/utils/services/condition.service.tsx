import Condition from '@/models/db/condition'

export function retrieveCondition(key: string): Promise<Condition> {
  return (async () => {
    const condition = await (
      await fetch(`http://localhost:3000/api/conditions?name=${key}`)
    ).json()
    return condition.length > 0 ? condition[0] : undefined
  })()
}
