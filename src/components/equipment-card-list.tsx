import { Equipment } from '@/models/equipment'
import EquipmentCard from './equipment-card'

export default async function EquipmentCardList() {
  let equipment: Equipment[] = []

  return (
    <div>
      <div>
        {equipment.map((value) => (
          <div key={value.name} className="pb-4">
            <EquipmentCard value={value}></EquipmentCard>
          </div>
        ))}
      </div>
    </div>
  )
}
