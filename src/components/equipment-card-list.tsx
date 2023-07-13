import { Equipment } from '@/models/equipment'
import EquipmentCard from './equipment-card'

export default function EquipmentCardList({
  equipment,
}: {
  equipment: Equipment[]
}) {
  return (
    <div className="h-full w-full">
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
