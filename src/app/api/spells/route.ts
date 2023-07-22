import { Spell } from '@/models/spell'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  let data = allSpells

  if (name) {
    data = allSpells.filter((spell) => spell.name === name)
  }

  return NextResponse.json(data)
}

const allSpells: Spell[] = [
  {
    id: '1',
    name: 'electric arc',
    traits: ['cantrip', 'electric', 'evocation'],
    traditions: ['arcane', 'primal'],
    activation: {
      num_actions: 'two',
      action: 'Cast a Spell',
      traits: ['somatic', 'verbal'],
      range: {
        value: 30,
        unit: 'feet',
      },
      targets: '1 or 2 creatures',
    },
    saving_throw: 'basic Reflex',
    description:
      'An arc of lightning leaps from one target to another. You deal electricity damage equal to 1d4 plus your spellcasting ability modifier.',
    heightened: {
      type: 'formula',
      value: {
        level_modifier: 1,
        description: 'The damage increases by 1d4.',
      },
    },
    rank: 0,
    source: [{ title: 'Core Rulebook', page: '335' }],
    entity_type: 'SPELL',
  },
  {
    id: '2',
    name: 'detect magic',
    traits: ['cantrip', 'detection', 'divination'],
    traditions: ['arcane', 'primal', 'divine', 'occult'],
    activation: {
      num_actions: 'two',
      action: 'Cast a Spell',
      traits: ['somatic', 'verbal'],
      area: {
        value: 30,
        unit: 'emanataion',
      },
    },
    description:
      "You send out a pulse that registers the presence of magic. You receive no information beyond the presence or absence of magic. You can choose to ignore magic you're fully aware of, such as the magic items and ongoing spells of you and your allies.<br/><br/>You detect @trait:illusion@ magic only if that magic's effect has a lower level than the level of your <i>detect magic</i> spell. However, items that have an illusion aura but aren't deceptive in appearance (such as an @equipment:invisibility potion@) typically are detected normally.",
    heightened: {
      type: 'explicit',
      value: [
        {
          level: 3,
          description:
            'You learn the school of magic for the highest-level effect within range that the spell detects. If multiple effects are equally strong, the GM determines which you learn.',
        },
        {
          level: 4,
          description:
            "As 3rd level, but you also pinpoint the source of the highest-level magic. Like for an imprecise sense, you don't learn the exact location, but can narrow down the source to within a 5-foot cube (or the nearest if larger than that).",
        },
      ],
    },
    rank: 0,
    source: [{ title: 'Core Rulebook', page: '328' }],
    entity_type: 'SPELL',
  },
  {
    id: '3',
    name: 'invisibility',
    traits: ['illusion'],
    traditions: ['arcane', 'occult'],
    activation: {
      num_actions: 'two',
      action: 'Cast a Spell',
      traits: ['material', 'somatic'],
      range: { unit: 'touch' },
      targets: '1 creature',
      duration: {
        value: 10,
        unit: 'minutes',
      },
    },
    description:
      'Cloaked in illusion, the target becomes @condition:invisible@. This makes it @condition:undetected@ to all creatures, though the creatures can attempt to find the target, making it @condition:hidden@ to them instead. If the target uses a hostile action, the spell ends after that hostile action is completed.',
    heightened: {
      type: 'explicit',
      value: [
        {
          level: 4,
          description:
            "The spell lasts 1 minute, but it doesn't end if the target uses a hostile action.",
        },
      ],
    },
    rank: 2,
    source: [{ title: 'Core Rulebook', page: '347' }],
    entity_type: 'SPELL',
  },
  {
    id: '4',
    name: 'magic missile',
    traits: ['evocation', 'force'],
    traditions: ['arcane', 'occult'],
    activation: {
      num_actions: 'one-to-three',
      action: 'Cast a Spell',
      traits: ['somatic', 'verbal'],
      range: { unit: 'feet', value: 120 },
      targets: '1 creature',
    },
    description:
      'You send a dart of force streaking toward a creature that you can see. It automatically hits and deals 1d4+1 force damage. For each additional action you use when Casting the Spell, increase the number of missiles you shoot by one, to a maximum of three missiles for 3 actions. You choose the target for each missile individually. If you shoot more than one missile at the same target, combine the damage before applying bonuses or penalties to damage, resistances, weaknesses, and so forth.',
    heightened: {
      type: 'formula',
      value: {
        level_modifier: 2,
        description:
          'You shoot one additional missile with each action you spend.',
      },
    },
    rank: 1,
    source: [{ title: 'Core Rulebook', page: '349' }],
    entity_type: 'SPELL',
  },
  {
    id: '5',
    name: 'telekinetic projectile',
    traits: ['attack', 'cantrip', 'evocation'],
    traditions: ['arcane', 'occult'],
    saving_throw: {
      critical_success: 'You deal double damage.',
      success: 'You deal full damage.',
    },
    activation: {
      num_actions: 'two',
      action: 'Cast a Spell',
      traits: ['somatic', 'verbal'],
      range: { unit: 'feet', value: 120 },
      targets: '1 creature',
    },
    description:
      'You hurl a loose, unattended object that is within range and that has 1 Bulk or less at the target. Make a spell attack roll against the target. If you hit, you deal bludgeoning, piercing, or slashing damage-as appropriate for the object you hurled-equal to 1d6 plus your spellcasting ability modifier. No specific traits or magic properties of the hurled item affect the attack or the damage.',
    heightened: {
      type: 'formula',
      value: {
        level_modifier: 1,
        description: 'The damage increases by 1d6.',
      },
    },
    rank: 1,
    source: [{ title: 'Core Rulebook', page: '377' }],
    entity_type: 'SPELL',
  },
]
