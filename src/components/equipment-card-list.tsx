import { Equipment } from '@/models/equipment'
import EquipmentCard from './equipment-card'
import { roboto_serif, roboto_serif_italic } from '@/utils/fonts'

export default function EquipmentCardList({
  equipment,
}: {
  equipment: Equipment[]
}) {
  return (
    <div className="h-full w-full">
      {equipment.length < 1 && (
        <span
          className={`${roboto_serif_italic.className} flex justify-center mt-8 text-slate-400 text-sm`}
        >
          Try selecting an item
        </span>
      )}
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
