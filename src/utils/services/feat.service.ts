import { Feat } from '@/models/db/feat'

export function retrieveFeat(key: string): Promise<Feat> {
  return (async () => {
    const feats = await (
      await fetch(`http://localhost:3000/api/feats?name=${key}`)
    ).json()
    return feats.length > 0 ? feats[0] : undefined
  })()
}
