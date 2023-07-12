import { Equipment, EquipmentVariantType } from '@/models/equipment'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const equipment: Equipment[] = [...allEquipment]
  for (let i = 0; i < equipment.length; i++) {
    let item = equipment[i]

    // converts an item with variants into their own standalone items.
    if (item.types && item.types.length > 0) {
      const variants: Equipment[] = item.types.map(
        (variant: EquipmentVariantType) => {
          return {
            ...item,
            ...variant,
            name: variant.name + ' ' + item.name,
            description:
              item.description + '<br /><br />' + variant.description,
            types: [],
          }
        }
      )
      equipment.splice(i, 1, ...variants)
    }
  }

  return NextResponse.json(equipment)
}

const allEquipment: Equipment[] = [
  {
    id: '1',
    name: 'magnifying glass',
    description:
      'This quality handheld lens gives you a +1 item bonus to Perception checks to notice minute details of documents, fabric, and the like.',
    price: [{ value: 40, type: 'gp' }],
    level: 3,
    source: {
      title: 'Core Rulebook',
      page: '288',
    },
    category: 'Adventuring Gear',
    hands: '1',
  },
  {
    id: '2',
    name: 'potion of expeditious retreat',
    description:
      'The stopper for a <i>potion of expeditious retreat</i> is crafted to easily snap open in dire circumstances. When you drink this potion, you become @condition:fleeing@ for 1 minute, and you gain a +40-foot status bonus to all your Speeds for the duration as long as you are fleeing. You immediately Stride.',
    price: [{ value: 3, type: 'gp' }],
    bulk: 'L',
    level: 1,
    source: {
      title: "Advanced Player's Guide",
      page: '258',
    },
    category: 'Potion',
    usage: 'held in 1 hand',
    traits: ['consumable', 'magical', 'potion', 'transmutation'],
    activation: {
      numActions: 1,
      action: 'Interact',
    },
  },
  {
    id: '3',
    name: 'healing potion',
    description:
      "A <i>healing potion</i> is a vial of a ruby-red liquid that imparts a tingling sensation as the drinker's wounds heal rapidly. When you drink a <i>healing potion</i>, you regain the listed number of Hit Points.",
    source: {
      title: 'Core Rulebook',
      page: '563',
    },
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
        price: [{ value: 4, type: 'gp' }],
        level: 1,
        description: 'The potion restores 1d8 Hit Points',
      },
      {
        name: 'lesser',
        price: [{ value: 12, type: 'gp' }],
        level: 3,
        description: 'The potion restores 2d8 + 5 Hit Points',
      },
      {
        name: 'moderate',
        price: [{ value: 50, type: 'gp' }],
        level: 6,
        description: 'The potion restores 3d8 + 10 Hit Points',
      },
      {
        name: 'greater',
        price: [{ value: 400, type: 'gp' }],
        level: 12,
        description: 'The potion restores 6d8 + 20 Hit Points',
      },
      {
        name: 'major',
        price: [{ value: 5000, type: 'gp' }],
        level: 18,
        description: 'The potion restores 8d8 + 30 Hit Points',
      },
    ],
  },
  {
    id: '4',
    name: 'rhinocerous mask',
    description:
      'Covered with thick armor and bearing a thicker horn, a <i>rhinoceros mask</i> grants you increased momentum. If you Stride at least 10 feet, your next melee Strike before the end of your turn ignores the Hardness of objects with a Hardness of 5 or less. If the object has more than Hardness 5, the mask grants no benefit.    ',
    source: {
      title: 'Treasure Vault',
      page: '155',
    },
    usage: 'worn mask',
    category: 'Worn Item',
    traits: ['invested', 'magical', 'transmutation'],
    types: [
      {
        price: [{ value: 90, type: 'gp' }],
        level: 4,
        name: '',
        description: '',
      },
      {
        price: [{ value: 425, type: 'gp' }],
        level: 8,
        name: 'greater',
        description:
          'Your melee Strikes ignore the Hardness of objects with a Hardness of 10 or less.',
      },
    ],
    rarity: 'uncommon',
  },
]
