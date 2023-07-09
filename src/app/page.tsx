import EquipmentCard from '@/components/equipment-card'
import { Equipment } from '@/models/equipment'

export default function Home() {
  const magnifyingGlass: Equipment = {
    name: 'Magnifying glass',
    description:
      'This quality handheld lens gives you a +1 item bonus to Perception checks to notice minute details of documents, fabric, and the like.',
    price: '40gp',
    bulk: '-',
    level: 3,
    source: 'Core Rulebook (288)',
    category: 'Adventuring Gear',
    hands: '1',
  }

  return (
    <main>
      <div className="flex justify-center pt-5">
        <p className="text-5xl">grimoire</p>
      </div>
      <div>
        <div className="container mx-auto mt-6">
          <EquipmentCard value={magnifyingGlass}></EquipmentCard>
        </div>
      </div>
    </main>
  )
}
