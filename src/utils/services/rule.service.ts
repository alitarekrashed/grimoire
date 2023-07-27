import Rule from '@/models/rule'

export function retrieveRule(key: string): Promise<Rule> {
  return (async () => {
    const rules = await (
      await fetch(`http://localhost:3000/api/rules?name=${key}`)
    ).json()
    return rules.length > 0 ? rules[0] : undefined
  })()
}
