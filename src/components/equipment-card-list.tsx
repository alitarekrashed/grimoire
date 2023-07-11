import { Equipment } from '@/models/equipment'
import EquipmentCard from './equipment-card'

export default async function EquipmentCardList() {
  let equipment: Equipment[] = await getEquipment()

  return (
    <div>
      <div className="container mx-auto">
        {equipment.map((value) => (
          <div key={value.name} className="pb-4">
            <EquipmentCard value={value}></EquipmentCard>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getEquipment(): Promise<Equipment[]> {
  const res = await fetch('http://localhost:3000/api/equipment', {
    cache: 'no-store',
  })
  return (await res.json()).data as Equipment[]
}
