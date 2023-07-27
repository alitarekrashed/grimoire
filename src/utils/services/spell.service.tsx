import { Spell } from '@/models/db/spell'

export function retrieveSpell(key: string): Promise<Spell> {
  return (async () => {
    const spells = await (
      await fetch(`http://localhost:3000/api/spells?name=${key}`)
    ).json()
    return spells.length > 0 ? spells[0] : undefined
  })()
}
