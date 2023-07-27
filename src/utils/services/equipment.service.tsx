import { Equipment } from '@/models/db/equipment'

export function retrieveEquipment(key: string): Promise<Equipment> {
  return (async () => {
    const equipment = await (
      await fetch(`http://localhost:3000/api/equipment?name=${key}`)
    ).json()
    return equipment.length > 0 ? equipment[0] : undefined
  })()
}
