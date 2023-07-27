import Trait from '@/models/db/trait'

export function retrieveTrait(key: string): Promise<Trait> {
  return (async () => {
    const traits = await (
      await fetch(`http://localhost:3000/api/traits?name=${key}`)
    ).json()
    return traits.length > 0 ? traits[0] : undefined
  })()
}
