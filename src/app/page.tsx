import EquipmentCard from '@/components/equipment-card'
import { Equipment } from '@/models/equipment'

export default function Home() {
  const magnifyingGlass: Equipment = {
    name: 'Magnifying glass',
    description:
      'This quality handheld lens gives you a +1 item bonus to Perception checks to notice minute details of documents, fabric, and the like.',
    price: '40gp',
    level: 3,
    source: 'Core Rulebook (288)',
    category: 'Adventuring Gear',
    hands: '1',
  }

  // TODO can i do a popover for 'fleeing' in the description?
  const potionOfExpeditiousRetreat: Equipment = {
    name: 'Potion of Expeditious Retreat',
    description:
      'The stopper for a potion of expeditious retreat is crafted to easily snap open in dire circumstances. When you drink this potion, you become fleeing for 1 minute, and you gain a +40-foot status bonus to all your Speeds for the duration as long as you are fleeing. You immediately Stride.    ',
    price: '3gp',
    bulk: 'L',
    level: 1,
    source: "Advanced Player's Guide (258)",
    category: 'Potion',
    usage: 'held in 1 hand',
    traits: ['consumable', 'magical', 'potion', 'transmutation'],
    activation: {
      numActions: 1,
      action: 'Interact',
    },
  }

  return (
    <main>
      <div className="flex justify-center pt-5">
        <p className="text-5xl">grimoire</p>
      </div>
      <div>
        <div className="container mx-auto mt-6">
          <div className="pb-4">
            <EquipmentCard value={magnifyingGlass}></EquipmentCard>
          </div>
          <div>
            <EquipmentCard value={potionOfExpeditiousRetreat}></EquipmentCard>
          </div>
        </div>
      </div>
    </main>
  )
}
