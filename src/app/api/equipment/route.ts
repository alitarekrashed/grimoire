import {
  Equipment,
  EquipmentVariantType,
  EquipmentWithVariants,
} from '@/models/equipment'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keepCollapsed = searchParams.get('keepCollapsed')

  const equipment: (Equipment | EquipmentWithVariants)[] = [...allEquipment]
  if (!keepCollapsed) {
    for (let i = 0; i < equipment.length; i++) {
      // converts an item with variants into their own standalone items.
      if (equipment[i].entity_type === 'EQUIPMENT_WITH_VARIANTS') {
        let item = equipment[i] as EquipmentWithVariants
        const variants: Equipment[] = item.types.map(
          (variant: EquipmentVariantType) => {
            return {
              ...item,
              ...variant,
              id: item.id + '_' + variant.name,
              name: variant.name,
              description:
                item.description +
                (variant.description
                  ? '<br /><br />' + variant.description
                  : ''),
              types: [],
              entity_type: 'EQUIPMENT',
            }
          }
        )
        equipment.splice(i, 1, ...variants)
      }
    }
  }

  return NextResponse.json(equipment)
}

const allEquipment: (Equipment | EquipmentWithVariants)[] = [
  {
    id: '1',
    name: 'magnifying glass',
    description:
      'This quality handheld lens gives you a +1 item bonus to Perception checks to notice minute details of documents, fabric, and the like.',
    price: [{ value: 40, type: 'gp' }],
    level: 3,
    source: [
      {
        title: 'Core Rulebook',
        page: '288',
      },
    ],
    category: 'Adventuring Gear',
    hands: 1,
    entity_type: 'EQUIPMENT',
  },
  {
    id: '2',
    name: 'potion of expeditious retreat',
    description:
      'The stopper for a <i>potion of expeditious retreat</i> is crafted to easily snap open in dire circumstances. When you drink this potion, you become @condition:fleeing@ for 1 minute, and you gain a +40-foot status bonus to all your Speeds for the duration as long as you are fleeing. You immediately Stride.',
    price: [{ value: 3, type: 'gp' }],
    bulk: 'L',
    level: 1,
    source: [
      {
        title: "Advanced Player's Guide",
        page: '258',
      },
    ],
    category: 'Potion',
    usage: 'held in 1 hand',
    traits: ['consumable', 'magical', 'potion', 'transmutation'],
    activation: {
      num_actions: 'one',
      action: 'Interact',
    },
    entity_type: 'EQUIPMENT',
  },
  {
    id: '3',
    name: 'healing potion',
    description:
      "A <i>healing potion</i> is a vial of a ruby-red liquid that imparts a tingling sensation as the drinker's wounds heal rapidly. When you drink a <i>healing potion</i>, you regain the listed number of Hit Points.",
    source: [
      {
        title: 'Core Rulebook',
        page: '563',
      },
    ],
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
      num_actions: 'one',
      action: 'Interact',
    },
    types: [
      {
        name: 'minor healing potion',
        price: [{ value: 4, type: 'gp' }],
        level: 1,
        description: 'The potion restores 1d8 Hit Points',
      },
      {
        name: 'lesser healing potion',
        price: [{ value: 12, type: 'gp' }],
        level: 3,
        description: 'The potion restores 2d8 + 5 Hit Points',
      },
      {
        name: 'moderate healing potion',
        price: [{ value: 50, type: 'gp' }],
        level: 6,
        description: 'The potion restores 3d8 + 10 Hit Points',
      },
      {
        name: 'greater healing potion',
        price: [{ value: 400, type: 'gp' }],
        level: 12,
        description: 'The potion restores 6d8 + 20 Hit Points',
      },
      {
        name: 'major healing potion',
        price: [{ value: 5000, type: 'gp' }],
        level: 18,
        description: 'The potion restores 8d8 + 30 Hit Points',
      },
    ],
    entity_type: 'EQUIPMENT_WITH_VARIANTS',
  },
  {
    id: '4',
    name: 'rhinocerous mask',
    description:
      'Covered with thick armor and bearing a thicker horn, a <i>rhinoceros mask</i> grants you increased momentum. If you Stride at least 10 feet, your next melee Strike before the end of your turn ignores the Hardness of objects with a Hardness of 5 or less. If the object has more than Hardness 5, the mask grants no benefit.',
    source: [
      {
        title: 'Treasure Vault',
        page: '155',
      },
    ],
    usage: 'worn mask',
    category: 'Worn Item',
    traits: ['invested', 'magical', 'transmutation'],
    types: [
      {
        price: [{ value: 90, type: 'gp' }],
        level: 4,
        name: 'rhinocerous mask',
        description: '',
      },
      {
        price: [{ value: 425, type: 'gp' }],
        level: 8,
        name: 'greater rhinocerous mask',
        description:
          'Your melee Strikes ignore the Hardness of objects with a Hardness of 10 or less.',
      },
    ],
    rarity: 'uncommon',
    entity_type: 'EQUIPMENT_WITH_VARIANTS',
  },
  {
    id: '5',
    name: 'cloak of gnawing leaves',
    description:
      'This cloak appears to be woven from a thousand living leaves, hungry for flesh and eager to defend the cloak’s wearer.',
    source: [
      {
        title: 'Gatewalkers',
        page: '80',
      },
    ],
    bulk: 'L',
    usage: 'worn cloak',
    category: 'Worn Item',
    traits: ['invested', 'magical', 'primal', 'transmutation'],
    activation: {
      num_actions: 'reaction',
      traits: ['envision'],
      frequency: 'once per day',
      trigger: 'You are damaged by a melee attack from an adjacent creature',
      effect: {
        description:
          'The leaves lash out at your attacker, rising up to reveal snapping jaws made of wicked thorns. The triggering creature must attempt a DC 17 Reflex saving throw.',
        saving_throw: {
          success: 'The creature is unaffected.',
          failure: 'The creature takes 1d4 piercing damage.',
          critical_failure:
            'The creature takes 2d4 piercing damage and 1 bleed damage.',
        },
      },
    },
    types: [
      {
        price: [{ value: 60, type: 'gp' }],
        level: 3,
        name: 'cloak of gnawing leaves',
        description: '',
      },
      {
        price: [{ value: 330, type: 'gp' }],
        level: 7,
        name: 'cloak of thirsty fronds',
        description:
          'The save DC is 23, and the cloak can be activated once per minute. The leaves deal 1d6 piercing damage to a creature on a failed save, or 2d6 piercing damage and 2 bleed damage on a critical failure.',
      },
      {
        price: [{ value: 2000, type: 'gp' }],
        level: 12,
        name: 'cloak of devouring thorns',
        description:
          'The save DC is 30, and the cloak can be activated once per round. The leaves deal 2d6 piercing damage to a creature on a failed save, or 4d6 piercing damage and 3 bleed damage on a critical failure.',
      },
    ],
    rarity: 'rare',
    entity_type: 'EQUIPMENT_WITH_VARIANTS',
  },
  {
    id: '6',
    name: 'escape fulu',
    description:
      'The <i>escape fulu</i> is a charm common among wealthy people, who wear the talisman in case of kidnapping. When you Activate this fulu, for 1 minute, you gain +2 status bonus to your attempts to Escape as well as to Stealth checks to Hide and Sneak.',
    level: 7,
    usage: 'affixed to armor',
    price: [{ value: 70, type: 'gp' }],
    activation: {
      num_actions: 'free',
      trigger: 'You attempt to Escape.',
      traits: ['envision'],
    },
    category: 'Fulu',
    traits: ['consumable', 'fulu', 'magical', 'talisman', 'transmutation'],
    entity_type: 'EQUIPMENT',
    source: [{ title: 'Treasure Vault', page: '77' }],
  },
  {
    id: '7',
    name: 'cooperative waffles',
    usage: 'held in 2 hands',
    description:
      "Flash-cooked on a waffle iron and drizzled with alchemical syrups and compound butter, cooperative waffles bolster the supportive spirit of those who share the batch. You can split the waffles with one other creature. After you both eat half of the waffles to Activate them, when one of you uses Follow the Expert to follow the other, the circumstance bonus granted is 1 higher. The waffles' bonus lasts 24 hours or until you next make your daily preparations, whichever comes first. You can only be linked to one creature in this way at a time; if either of you eats cooperative waffles again, the effect of your previous waffles ends.",
    bulk: 'L',
    traits: ['alchemical', 'consumable', 'processed'],
    activation: {
      num_actions: '10 minutes',
      action: 'Interact',
    },
    types: [
      {
        name: 'cooperative waffles',
        level: 2,
        description: '',
        price: [{ value: 2, type: 'gp' }],
      },
      {
        name: 'greater cooperative waffles',
        level: 5,
        description:
          'The benefit of the waffles also applies when one of you successfully Aids a skill check the other attempts.',
        price: [{ value: 25, type: 'gp' }],
      },
    ],
    source: [{ title: 'Treasure Vault', page: '47' }],
    category: 'Alchemical Foods',
    entity_type: 'EQUIPMENT_WITH_VARIANTS',
  },
]
