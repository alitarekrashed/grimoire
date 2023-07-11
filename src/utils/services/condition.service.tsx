import Condition from '@/models/condition'

export function retrieveCondition(key: string): Promise<Condition> {
  return (async () => {
    const condition = await (
      await fetch(`http://localhost:3000/api/conditions/${key}`)
    ).json()
    return condition
  })()
}
