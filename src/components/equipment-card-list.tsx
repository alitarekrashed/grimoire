import { Equipment } from '@/models/equipment'
import EquipmentCard from './equipment-card'

export default function EquipmentCardList({ value }: { value: Equipment[] }) {
  return (
    <div>
      <div className="container mx-auto">
        {value.map((val) => (
          <div key={val.name} className="pb-4">
            <EquipmentCard value={val}></EquipmentCard>
          </div>
        ))}
      </div>
    </div>
  )
}
