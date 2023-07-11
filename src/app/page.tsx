import EquipmentCardList from '@/components/equipment-card-list'
import { Equipment } from '@/models/equipment'

export default function Home() {
  return (
    <main>
      <div className="flex justify-center pt-5 mb-4">
        <h1 className="text-5xl">grimoire</h1>
      </div>
      <EquipmentCardList></EquipmentCardList>
    </main>
  )
}
