import EquipmentCardList from '@/components/equipment-card-list'
import { Equipment } from '@/models/equipment'

export default function Home() {
  const magnifyingGlass: Equipment = {
    name: 'Magnifying glass',
    description:
      'This quality handheld lens gives you a +1 item bonus to Perception checks to notice minute details of documents, fabric, and the like.',
    price: '40 gp',
    level: 3,
    source: 'Core Rulebook (288)',
    category: 'Adventuring Gear',
    hands: '1',
  }

  // TODO can i do a popover for 'fleeing' in
  const potionOfExpeditiousRetreat: Equipment = {
    name: 'Potion of Expeditious Retreat',
    description:
      'The stopper for a potion of expeditious retreat is crafted to easily snap open in dire circumstances. When you drink this potion, you become fleeing for 1 minute, and you gain a +40-foot status bonus to all your Speeds for the duration as long as you are fleeing. You immediately Stride.    ',
    price: '3 gp',
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

  const healingPotion: Equipment = {
    name: 'Healing Potion',
    description:
      "A healing potion is a vial of a ruby-red liquid that imparts a tingling sensation as the drinker's wounds heal rapidly. When you drink a healing potion, you regain the listed number of Hit Points.",
    source: 'Core Rulebook (563)',
    category: 'Potion',
    usage: 'held in 1 hand',
    traits: [
      'consumable',
      'healing',
      'magical',
      'necromancy',
      'positive',
      'potion',
    ],
    bulk: 'L',
    activation: {
      numActions: 1,
      action: 'Interact',
    },
    types: [
      {
        name: 'minor',
        price: '4 gp',
        level: 1,
        description: 'The potion restores 1d8 Hit Points',
      },
      {
        name: 'lesser',
        price: '12 gp',
        level: 3,
        description: 'The potion restores 2d8 + 5 Hit Points',
      },
      {
        name: 'moderate',
        price: '50 gp',
        level: 6,
        description: 'The potion restores 3d8 + 10 Hit Points',
      },
      {
        name: 'greater',
        price: '400 gp',
        level: 12,
        description: 'The potion restores 6d8 + 20 Hit Points',
      },
      {
        name: 'major',
        price: '5,000 gp',
        level: 18,
        description: 'The potion restores 8d8 + 30 Hit Points',
      },
    ],
  }

  return (
    <main>
      <div className="flex justify-center pt-5">
        <p className="text-5xl">grimoire</p>
      </div>
      <EquipmentCardList
        value={[magnifyingGlass, potionOfExpeditiousRetreat, healingPotion]}
      ></EquipmentCardList>
    </main>
  )
}
